import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  getPurchases,
  getSubscription,
  downloadInvoice,
} from "../controllers/profileController.js";

const router = Router();

router.use(protect);

router.get("/", getProfile);
router.patch("/", updateProfile);
router.get("/purchases", getPurchases);
router.get("/subscription", getSubscription);
router.get("/invoices/:purchaseId/download", downloadInvoice);

export default router;
