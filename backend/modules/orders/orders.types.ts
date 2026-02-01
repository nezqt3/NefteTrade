import { ListingStatus } from "@modules/listings/listings.types";

export interface Order {
  title: string;
  listingId: number;
  customerId: number;
  rate: number;
  receiverId: number;
  status: ListingStatus;
  createdAt: Date;
}
