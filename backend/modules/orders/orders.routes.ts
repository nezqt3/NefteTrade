import { Router } from "express";
import { OrdersController } from "./orders.controller";

const router = Router();

router.get("/user/:userId", OrdersController.getUserOrders);

router.post("/", OrdersController.createOrder);

router.delete("/:orderId", OrdersController.deleteOrder);

router.patch("/:orderId/status", OrdersController.updateStatus);

router.patch("/:orderId/rate", OrdersController.setRate);

export default router;
