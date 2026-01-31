import {
  createListing,
  deleteListing,
  getListing,
  getListings,
  updateListing,
} from "./listings.repository";
import { Listing, ListingsFilter } from "./listings.types";

export async function getListingsService(filter: ListingsFilter) {
  const listings = await getListings(filter);

  return {
    success: true,
    listings,
    meta: {
      limit: filter.limit,
      offset: filter.offset,
    },
  };
}

export async function getOneOfListingsService(listingId: string) {
  try {
    const listing = await getListing(listingId);
    return listing;
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function createListingService(body: Listing) {
  try {
    await createListing(body);

    if (!body.ownerId) {
      throw new Error("Owner ID is required");
    }

    return {
      success: true,
      message: "Listing created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function updateListingService(
  body: Partial<Listing> & { id: string },
) {
  try {
    await updateListing(body);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function deleteListingService(listingId: string) {
  try {
    await deleteListing(listingId);
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
