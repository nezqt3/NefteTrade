import { OilProduct } from "../../shared/constants";

export type ListingStatus = "draft" | "active" | "completed" | "blocked";

export interface ListingsFilter {
  price?: {
    gte?: number;
    lte?: number;
  };
  quantity?: {
    gte?: number;
    lte?: number;
  };
  productType?: OilProduct;
  status?: ListingStatus;
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
  loadAddress?: string;
  unloadAddress?: string;
  loadingMethod?: "top" | "bottom";
  pumpRequired?: boolean;
  ownerId?: string;
  limit: number;
  offset: number;
}

export interface ListingsQuery {
  limit?: string;
  page?: string;

  minPrice?: string;
  maxPrice?: string;

  productType?: string;
  status?: string;

  fromDate?: string;
  toDate?: string;

  fromCity?: string;
  toCity?: string;
  quantityMin?: string;
  quantityMax?: string;
  loadingMethod?: string;
  needsPump?: string;
}

export interface Listing {
  id: string;
  ownerId: string;
  loadAddress: string;
  unloadAddress: string;
  productType: OilProduct;
  quantity: number;
  loadingMethod: "top" | "bottom";
  pumpRequired: boolean;
  price: number;
  status: ListingStatus;
  createdAt: Date;
}
