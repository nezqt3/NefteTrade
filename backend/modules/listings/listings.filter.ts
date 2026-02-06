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
    quantity: buildQuantityFilter(query),
    productType: parseProductType(query.productType),
    status: parseStatus(query.status),
    createdAt: buildDateFilter(query),
    loadAddress: query.fromCity,
    unloadAddress: query.toCity,
    loadingMethod: parseLoadingMethod(query.loadingMethod),
    pumpRequired: parsePumpRequired(query.needsPump),
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
  if (
    [
      "gasoline",
      "gasoline_92",
      "gasoline_95",
      "gasoline_98",
      "diesel",
      "kerosene",
      "lpg",
      "mazut",
      "oil",
      "fuel_oil",
      "gas_oil",
    ].includes(value ?? "")
  ) {
    return value as OilProduct;
  }
}

function parseStatus(value?: string) {
  if (["draft", "active", "completed", "blocked"].includes(value ?? "")) {
    return value as any;
  }
}

function buildQuantityFilter(query: ListingsQuery) {
  if (!query.quantityMin && !query.quantityMax) return undefined;

  return {
    gte: query.quantityMin ? Number(query.quantityMin) : undefined,
    lte: query.quantityMax ? Number(query.quantityMax) : undefined,
  };
}

function parseLoadingMethod(value?: string) {
  if (value === "top" || value === "bottom") return value;
}

function parsePumpRequired(value?: string) {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "1") return true;
  if (value === "0") return false;
}
