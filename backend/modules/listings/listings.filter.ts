import { ListingsFilter, ListingsQuery } from "./listings.types";
import { OilProduct } from "../../shared/constants";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function buildListingsFilter(query: ListingsQuery): ListingsFilter {
  const limit = Math.min(Number(query.limit) || DEFAULT_LIMIT, MAX_LIMIT);

  const page = Math.max(Number(query.page) || 1, 1);

  return {
    limit,
    offset: (page - 1) * limit,

    price: buildPriceFilter(query),
    productType: parseProductType(query.productType),
    status: parseStatus(query.status),
    createdAt: buildDateFilter(query),
  };
}

function buildPriceFilter(query: ListingsQuery) {
  if (!query.minPrice && !query.maxPrice) return undefined;

  return {
    gte: query.minPrice ? Number(query.minPrice) : undefined,
    lte: query.maxPrice ? Number(query.maxPrice) : undefined,
  };
}

function buildDateFilter(query: ListingsQuery) {
  if (!query.fromDate && !query.toDate) return undefined;

  return {
    gte: query.fromDate ? new Date(query.fromDate) : undefined,
    lte: query.toDate ? new Date(query.toDate) : undefined,
  };
}

function parseProductType(value?: string): OilProduct | undefined {
  if (["gasoline", "diesel", "oil"].includes(value ?? "")) {
    return value as OilProduct;
  }
}

function parseStatus(value?: string) {
  if (["draft", "active", "completed", "blocked"].includes(value ?? "")) {
    return value as any;
  }
}
