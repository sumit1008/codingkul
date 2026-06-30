import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createOrder, verifyPayment, validateCoupon } from "../controllers/paymentController.js";

const router = Router();

router.post("/validate-coupon", protect, validateCoupon);
router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

export default router;
