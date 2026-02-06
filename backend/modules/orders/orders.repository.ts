import { query } from "../../config/database";
import { Order } from "./orders.types";
import { ListingStatus } from "@modules/listings/listings.types";

export async function deleteOrder(orderId: string): Promise<void> {
  const sql = "DELETE FROM orders WHERE id = $1";
  await query(sql, [orderId]);
}

export async function getOrdersOfUser(userId: string): Promise<any[]> {
  const sql = `
    SELECT id, title, listing_id, customer_id, receiver_id, status, rate, created_at
    FROM orders
    WHERE customer_id = $1 OR receiver_id = $1
    ORDER BY created_at DESC
  `;
  const result = await query(sql, [userId]);
  return result.rows;
}

export async function setRateOfOrder(
  orderId: string,
  rate: number,
): Promise<void> {
  const sql = "UPDATE orders SET rate = $1 WHERE id = $2";
  await query(sql, [rate, orderId]);
}

export async function updateStatusOfOrder(status: ListingStatus, id: string) {
  const sql = "UPDATE orders SET status = $1 WHERE id = $2";
  try {
    await query(sql, [status, id]);
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
}

export async function createOrder(order: Order) {
  const sql =
    "INSERT INTO orders (title, listing_id, customer_id, receiver_id, status) VALUES ($1, $2, $3, $4, $5)";
  await query(sql, [
    order.title,
    order.listingId,
    order.customerId,
    order.receiverId,
    order.status,
  ]);
}
