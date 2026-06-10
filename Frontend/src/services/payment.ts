const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ProductOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  productId: string;
  productName: string;
}

export interface VerifyPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/** Loads the Razorpay checkout script once per page load */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/** Creates a Razorpay order for a specific product */
export async function createProductOrder(productId: string): Promise<ProductOrderResponse> {
  const res = await fetch(`${API}/payment/create-order`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create order");
  return data.data as ProductOrderResponse;
}

/** Sends payment details to backend for signature verification */
export async function verifyPayment(payload: VerifyPayload): Promise<void> {
  const res = await fetch(`${API}/payment/verify`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Payment verification failed");
}

export interface InitiateProductPaymentOptions {
  productId: string;
  userName: string;
  userEmail: string;
  onSuccess: () => void;
  onFailure: (reason: string) => void;
}

/**
 * Full product purchase flow:
 * 1. Load Razorpay script
 * 2. Create order on backend for the given productId
 * 3. Open Razorpay checkout
 * 4. On success: verify with backend → onSuccess
 * 5. On failure/cancel: onFailure
 */
export async function initiateProductPurchase(opts: InitiateProductPaymentOptions): Promise<void> {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    opts.onFailure("Could not load payment gateway. Check your internet connection.");
    return;
  }

  let order: ProductOrderResponse;
  try {
    order = await createProductOrder(opts.productId);
  } catch (err) {
    opts.onFailure(err instanceof Error ? err.message : "Failed to initiate payment");
    return;
  }

  const options = {
    key:         order.keyId,
    amount:      order.amount,
    currency:    order.currency,
    name:        "CodingKul Academy",
    description: order.productName,
    order_id:    order.orderId,
    prefill: {
      name:  opts.userName,
      email: opts.userEmail,
    },
    theme: { color: "#6366f1" },
    handler: async (response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) => {
      try {
        await verifyPayment({
          razorpay_order_id:   response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature:  response.razorpay_signature,
        });
        opts.onSuccess();
      } catch (err) {
        opts.onFailure(err instanceof Error ? err.message : "Verification failed");
      }
    },
    modal: {
      ondismiss: () => opts.onFailure("Payment cancelled"),
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rzp = new (window as any).Razorpay(options);
  rzp.on("payment.failed", (response: { error: { description: string } }) => {
    opts.onFailure(response.error.description || "Payment failed");
  });
  rzp.open();
}
