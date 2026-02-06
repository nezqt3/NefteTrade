import { getListing } from "../listings/listings.repository";
import { getUserById } from "../users/users.repository";
import {
  createPayment,
  getPaymentById,
  getPaymentsByUser,
} from "./payments.repository";
import { CreatePaymentInput, Payment } from "./payments.types";

const CONTACT_UNLOCK_PRICE = 500;

export class PaymentsService {
  async createPaymentForAd(adId: number, userId: number): Promise<Payment> {
    const input: CreatePaymentInput = {
      listingId: adId,
      userId,
      amount: CONTACT_UNLOCK_PRICE,
      status: "pending",
    };
    return createPayment(input);
  }

  async completePaymentForAd(adId: number, userId: number): Promise<Payment> {
    const input: CreatePaymentInput = {
      listingId: adId,
      userId,
      amount: CONTACT_UNLOCK_PRICE,
      status: "completed",
    };
    return createPayment(input);
  }

  async getPaymentStatus(paymentId: number): Promise<Payment | null> {
    return getPaymentById(paymentId);
  }

  async getUserPayments(userId: number): Promise<Payment[]> {
    return getPaymentsByUser(userId);
  }

  async unlockContact(adId: number, userId: number) {
    const listing = await getListing(String(adId));
    if (!listing) throw new Error("Listing not found");

    const ownerId = Number((listing as any).owner_id ?? listing.ownerId);
    if (!ownerId) throw new Error("Listing owner not found");

    const owner = await getUserById(ownerId);
    if (!owner) throw new Error("Owner not found");

    await this.completePaymentForAd(adId, userId);

    return { phone: owner.numberPhone };
  }
}
