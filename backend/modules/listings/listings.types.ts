import { OilProduct } from "../../shared/constants";

export interface ListingsFilter {
  from?: string;
  to?: string;
  productType?: OilProduct;
  minPrice?: number;
  maxPrice?: number;
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
  status: "draft" | "active" | "completed" | "blocked";
  createdAt: Date;
}