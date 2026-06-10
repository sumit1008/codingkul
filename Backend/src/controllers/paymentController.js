import crypto from "crypto";
import Razorpay from "razorpay";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { getProduct, getHighestPurchasedProduct, computeUpgradeAmountPaise } from "../data/products.js";

function getRazorpayInstance() {
  const keyId     = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Razorpay credentials are not configured");
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

/**
 * POST /api/payment/create-order
 * Body: { productId: "foundation" | "accelerator" | "placement" }
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error("productId is required");
  }

  const product = getProduct(productId);
  if (!product) {
    res.status(400);
    throw new Error("Invalid product");
  }

  const user = req.user;

  const alreadyPurchased = (user.purchasedProducts || []).some(
    (p) => p.productId === productId
  );
  if (alreadyPurchased) {
    res.status(400);
    throw new Error("You have already purchased this product.");
  }

  const razorpay = getRazorpayInstance();

  // Compute upgrade-discounted amount: subtract what user already paid
  const highestPurchasedProduct = getHighestPurchasedProduct(user.purchasedProducts || []);
  const chargeAmount = computeUpgradeAmountPaise(product, highestPurchasedProduct);

  // Receipt: "ck_" (3) + productId (max 11) + "_" + 8 chars + "_" + 7 chars = max 31 chars
  const shortId = user._id.toString().slice(-8);
  const shortTs = Date.now().toString().slice(-7);
  const receipt = `ck_${productId}_${shortId}_${shortTs}`;

  let order;
  try {
    order = await razorpay.orders.create({
      amount:   chargeAmount,
      currency: "INR",
      receipt,
      notes: {
        userId:    user._id.toString(),
        productId: product.productId,
      },
    });
  } catch (err) {
    console.error("[createOrder] Razorpay API error:", err?.error ?? err);
    throw new Error(err?.error?.description || err?.message || "Failed to create Razorpay order");
  }

  await Payment.create({
    userId:          user._id,
    productId:       product.productId,
    plan:            product.productId,
    amount:          chargeAmount,
    currency:        "INR",
    status:          "created",
    razorpayOrderId: order.id,
  });

  res.status(201).json({
    success: true,
    data: {
      orderId:     order.id,
      amount:      order.amount,       // actual charge (discounted)
      currency:    order.currency,
      keyId:       process.env.RAZORPAY_KEY_ID,
      productId:   product.productId,
      productName: product.name,
    },
  });
});

/**
 * POST /api/payment/verify
 * Verifies Razorpay signature and grants product access.
 */
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error("Missing payment verification fields");
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { status: "failed" }
    );
    res.status(400);
    throw new Error("Payment verification failed — invalid signature");
  }

  const paymentRecord = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

  if (!paymentRecord) {
    res.status(404);
    throw new Error("Payment record not found");
  }

  if (paymentRecord.status === "paid") {
    return res.json({ success: true, alreadyProcessed: true, productId: paymentRecord.productId });
  }

  await Payment.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    {
      status:            "paid",
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    }
  );

  const user = await User.findById(req.user._id);
  const alreadyHas = (user.purchasedProducts || []).some(
    (p) => p.productId === paymentRecord.productId
  );

  if (!alreadyHas) {
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        purchasedProducts: {
          productId:   paymentRecord.productId,
          productType: "batch",
          purchasedAt: new Date(),
          paymentId:   razorpay_payment_id,
          orderId:     razorpay_order_id,
        },
      },
    });
  }

  res.json({
    success:   true,
    message:   "Payment verified. Access unlocked!",
    productId: paymentRecord.productId,
  });
});
