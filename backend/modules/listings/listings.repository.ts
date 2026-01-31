import { connectToDatabase } from "../../config/database";
import { Listing, ListingsFilter } from "./listings.types";

export async function getListings(filter: ListingsFilter) {
  const client = await connectToDatabase();

  const conditions: string[] = [];
  const values: any[] = [];

  let i = 1;

  if (filter.productType) {
    conditions.push(`product_type = $${i++}`);
    values.push(filter.productType);
  }

  if (filter.status) {
    conditions.push(`status = $${i++}`);
    values.push(filter.status);
  }

  if (filter.price?.gte !== undefined) {
    conditions.push(`price >= $${i++}`);
    values.push(filter.price.gte);
  }

  if (filter.price?.lte !== undefined) {
    conditions.push(`price <= $${i++}`);
    values.push(filter.price.lte);
  }

  if (filter.createdAt?.gte) {
    conditions.push(`created_at >= $${i++}`);
    values.push(filter.createdAt.gte);
  }

  if (filter.createdAt?.lte) {
    conditions.push(`created_at <= $${i++}`);
    values.push(filter.createdAt.lte);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const query = `
    SELECT *
    FROM listings
    ${where}
    ORDER BY created_at DESC
    LIMIT $${i++}
    OFFSET $${i++}
  `;

  values.push(filter.limit, filter.offset);

  const result = await client.query(query, values);
  return result.rows;
}

export async function createListing(listing: Listing): Promise<void> {
  const client = await connectToDatabase();
  const query =
    "INSERT INTO listings (owner_id, load_address, unload_address, product_type, quantity, loading_method, pump_required, price, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
  await client.query(query, [
    listing.ownerId,
    listing.loadAddress,
    listing.unloadAddress,
    listing.productType,
    listing.quantity,
    listing.loadingMethod,
    listing.pumpRequired,
    listing.price,
    listing.status,
  ]);
}
