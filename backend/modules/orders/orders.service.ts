import * as OrdersRepo from "./orders.repository";
import { Order } from "./orders.types";
import { ListingStatus } from "@modules/listings/listings.types";

export class OrdersService {
  async getUserOrders(userId: string) {
    const orders = await OrdersRepo.getOrdersOfUser(userId);

    const asCustomer = orders.filter((o) => o.customer_id === parseInt(userId));
    const asReceiver = orders.filter((o) => o.receiver_id === parseInt(userId));

    const avgRateAsCustomer =
      asCustomer.reduce((sum, o) => sum + (o.rate || 0), 0) /
      (asCustomer.length || 1);
    const avgRateAsReceiver =
      asReceiver.reduce((sum, o) => sum + (o.rate || 0), 0) /
      (asReceiver.length || 1);

    return {
      orders,
      stats: {
        asCustomer: { count: asCustomer.length, avgRate: avgRateAsCustomer },
        asReceiver: { count: asReceiver.length, avgRate: avgRateAsReceiver },
      },
    };
  }

  async createOrder(order: Order) {
    await OrdersRepo.createOrder(order);
  }

  async deleteOrder(orderId: string) {
    await OrdersRepo.deleteOrder(orderId);
  }

  async setRate(orderId: string, rate: number) {
    await OrdersRepo.setRateOfOrder(orderId, rate);
  }

  async updateStatus(orderId: string, status: ListingStatus) {
    await OrdersRepo.updateStatusOfOrder(status, orderId);
  }
}
