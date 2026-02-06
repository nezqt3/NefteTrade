import { query } from "../../config/database";
import { CreatePaymentInput, Payment, PaymentStatus } from "./payments.types";

function mapPaymentRow(row: any): Payment {
  return {
    id: Number(row.id),
    listingId: Number(row.listing_id),
    userId: Number(row.user_id),
    amount: Number(row.amount),
    status: row.status as PaymentStatus,
    createdAt: row.created_at,
  };
}

export async function createPayment(
  input: CreatePaymentInput,
): Promise<Payment> {
  const createdAt = new Date().toISOString();
  const status = input.status ?? "pending";

  await query(
    `
      INSERT INTO payments (listing_id, user_id, amount, status, created_at)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [input.listingId, input.userId, input.amount, status, createdAt],
  );

  const { rows } = await query(
    `
      SELECT *
      FROM payments
      WHERE listing_id = $1 AND user_id = $2 AND created_at = $3
      ORDER BY id DESC
      LIMIT 1
    `,
    [input.listingId, input.userId, createdAt],
  );

  if (!rows[0]) {
    throw new Error("Payment not created");
  }

  return mapPaymentRow(rows[0]);
}

export async function getPaymentById(paymentId: number): Promise<Payment | null> {
  const { rows } = await query(
    `
      SELECT *
      FROM payments
      WHERE id = $1
    `,
    [paymentId],
  );

  return rows[0] ? mapPaymentRow(rows[0]) : null;
}

export async function getPaymentsByUser(userId: number): Promise<Payment[]> {
  const { rows } = await query(
    `
      SELECT *
      FROM payments
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
    [userId],
  );

  return rows.map(mapPaymentRow);
}
