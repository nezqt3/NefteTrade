import { TypedRequest, TypedRequestParams, TypedResponse } from "shared/http";
import { PaymentsService } from "./payments.service";

const paymentsService = new PaymentsService();

export class PaymentsController {
  static async createPayment(
    req: TypedRequest<{ adId: string }>,
    res: TypedResponse<any>,
  ) {
    try {
      const adId = Number(req.body.adId);
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      if (!adId) return res.status(400).json({ message: "adId required" });

      const payment = await paymentsService.createPaymentForAd(adId, userId);
      res.status(201).json({ payment });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Payment error" });
    }
  }

  static async getPaymentStatus(
    req: TypedRequestParams<{ id: string }>,
    res: TypedResponse<any>,
  ) {
    try {
      const paymentId = Number(req.params.id);
      const payment = await paymentsService.getPaymentStatus(paymentId);
      if (!payment) return res.status(404).json({ message: "Not found" });
      res.json(payment);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Payment error" });
    }
  }

  static async getMyPayments(req: TypedRequest<any>, res: TypedResponse<any>) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      const payments = await paymentsService.getUserPayments(userId);
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Payment error" });
    }
  }

  static async unlockContact(
    req: TypedRequestParams<{ id: string }>,
    res: TypedResponse<any>,
  ) {
    try {
      const adId = Number(req.params.id);
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      if (!adId) return res.status(400).json({ message: "adId required" });

      const result = await paymentsService.unlockContact(adId, userId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Payment error" });
    }
  }
}
