import { dbProvider, query } from "../../config/database";
import { Listing, ListingsFilter } from "./listings.types";

function buildWhere(filter: ListingsFilter) {
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

  if (filter.quantity?.gte !== undefined) {
    conditions.push(`quantity >= $${i++}`);
    values.push(filter.quantity.gte);
  }

  if (filter.quantity?.lte !== undefined) {
    conditions.push(`quantity <= $${i++}`);
    values.push(filter.quantity.lte);
  }

  if (filter.createdAt?.gte) {
    conditions.push(`created_at >= $${i++}`);
    values.push(filter.createdAt.gte);
  }

  if (filter.createdAt?.lte) {
    conditions.push(`created_at <= $${i++}`);
    values.push(filter.createdAt.lte);
  }

  if (filter.loadAddress) {
    if (dbProvider === "postgres") {
      conditions.push(`load_address ILIKE $${i++}`);
      values.push(`%${filter.loadAddress}%`);
    } else {
      conditions.push(`LOWER(load_address) LIKE $${i++}`);
      values.push(`%${filter.loadAddress.toLowerCase()}%`);
    }
  }

  if (filter.unloadAddress) {
    if (dbProvider === "postgres") {
      conditions.push(`unload_address ILIKE $${i++}`);
      values.push(`%${filter.unloadAddress}%`);
    } else {
      conditions.push(`LOWER(unload_address) LIKE $${i++}`);
      values.push(`%${filter.unloadAddress.toLowerCase()}%`);
    }
  }

  if (filter.loadingMethod) {
    conditions.push(`loading_method = $${i++}`);
    values.push(filter.loadingMethod);
  }

  if (filter.pumpRequired !== undefined) {
    conditions.push(`pump_required = $${i++}`);
    values.push(filter.pumpRequired);
  }

  if (filter.ownerId) {
    conditions.push(`owner_id = $${i++}`);
    values.push(filter.ownerId);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  return { where, values, nextIndex: i };
}

export async function getListings(filter: ListingsFilter) {
  const { where, values, nextIndex } = buildWhere(filter);

  const sql = `
    SELECT *
    FROM listings
    ${where}
    ORDER BY created_at DESC
    LIMIT $${nextIndex}
    OFFSET $${nextIndex + 1}
  `;

  values.push(filter.limit, filter.offset);

  const result = await query(sql, values);
  return result.rows;
}

export async function countListings(filter: ListingsFilter) {
  const { where, values } = buildWhere(filter);
  const queryText = `
    SELECT COUNT(*) as count
    FROM listings
    ${where}
  `;
  const result = await query<{ count: number }>(queryText, values);
  return Number(result.rows[0]?.count ?? 0);
}

export async function getListing(listingId: string) {
  const sql = "SELECT * FROM listings WHERE id = $1";
  const value = [listingId];
  const result = await query(sql, value);
  return result.rows[0];
}

export async function createListing(listing: Listing): Promise<void> {
  const sql =
    "INSERT INTO listings (owner_id, load_address, unload_address, product_type, quantity, loading_method, pump_required, price, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
  await query(sql, [
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

export async function updateListing(
  listing: Partial<Listing> & { id: string },
): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];
  let i = 1;

  if (listing.loadAddress !== undefined) {
    fields.push(`load_address = $${i++}`);
    values.push(listing.loadAddress);
  }

  if (listing.unloadAddress !== undefined) {
    fields.push(`unload_address = $${i++}`);
    values.push(listing.unloadAddress);
  }

  if (listing.productType !== undefined) {
    fields.push(`product_type = $${i++}`);
    values.push(listing.productType);
  }

  if (listing.quantity !== undefined) {
    fields.push(`quantity = $${i++}`);
    values.push(listing.quantity);
  }

  if (listing.loadingMethod !== undefined) {
    fields.push(`loading_method = $${i++}`);
    values.push(listing.loadingMethod);
  }

  if (listing.pumpRequired !== undefined) {
    fields.push(`pump_required = $${i++}`);
    values.push(listing.pumpRequired);
  }

  if (listing.price !== undefined) {
    fields.push(`price = $${i++}`);
    values.push(listing.price);
  }

  if (listing.status !== undefined) {
    fields.push(`status = $${i++}`);
    values.push(listing.status);
  }

  if (fields.length === 0) {
    return;
  }

  const sql = `
    UPDATE listings
    SET ${fields.join(", ")}
    WHERE id = $${i}
  `;
  values.push(listing.id);

  await query(sql, values);
}

export async function deleteListing(listingId: string): Promise<void> {
  const sql = "DELETE FROM listings WHERE id = $1";
  await query(sql, [listingId]);
}
