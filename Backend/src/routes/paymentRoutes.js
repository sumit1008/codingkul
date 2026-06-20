import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";

const router = Router();

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

export default router;
