export type PaymentStatus = "pending" | "completed" | "failed";

export interface Payment {
  id: number;
  listingId: number;
  userId: number;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
}

export interface CreatePaymentInput {
  listingId: number;
  userId: number;
  amount: number;
  status?: PaymentStatus;
}
