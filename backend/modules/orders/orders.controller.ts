import { Request, Response } from "express";
import { OrdersService } from "./orders.service";
import { ListingStatus } from "@modules/listings/listings.types";
import { Order } from "./orders.types";
import { TypedRequest, TypedRequestParams, TypedResponse } from "shared/http";

const ordersService = new OrdersService();

export class OrdersController {
  static async getUserOrders(
    req: TypedRequestParams<{ userId: string }>,
    res: TypedResponse<{}>,
  ) {
    try {
      const userId = req.params.userId;
      const data = await ordersService.getUserOrders(userId);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error getting user orders:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async createOrder(req: TypedRequest<Order>, res: TypedResponse<{}>) {
    try {
      const order: Order = req.body;
      await ordersService.createOrder(order);
      res.status(201).json({ message: "Order created successfully" });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async deleteOrder(
    req: TypedRequestParams<{ orderId: string }>,
    res: TypedResponse<{}>,
  ) {
    try {
      const orderId = req.params.orderId;
      await ordersService.deleteOrder(orderId);
      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateStatus(
    req: TypedRequestParams<{ orderId: string }>,
    res: TypedResponse<{}>,
  ) {
    try {
      const orderId = req.params.orderId;
      const { status } = req.body;
      await ordersService.updateStatus(orderId, status as ListingStatus);
      res.status(200).json({ message: "Order status updated successfully" });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async setRate(
    req: TypedRequestParams<{ orderId: string }>,
    res: TypedResponse<{}>,
  ) {
    try {
      const orderId = req.params.orderId;
      const { rate } = req.body;
      await ordersService.setRate(orderId, rate);
      res.status(200).json({ message: "Order rate updated successfully" });
    } catch (error) {
      console.error("Error setting order rate:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
