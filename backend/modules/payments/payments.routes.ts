import { Router } from "express";
import { PaymentsController } from "./payments.controller";
import { authMiddleware } from "../auth/auth.middleware";

const router = Router();

router.post("/", authMiddleware, PaymentsController.createPayment);
router.post("/unlock/:id", authMiddleware, PaymentsController.unlockContact);
router.get("/my", authMiddleware, PaymentsController.getMyPayments);
router.get("/:id", authMiddleware, PaymentsController.getPaymentStatus);

export default router;
