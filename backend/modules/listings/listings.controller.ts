import {
  TypedRequest,
  TypedRequestParams,
  TypedResponse,
} from "../../shared/http";
import { buildListingsFilter } from "./listings.filter";
import {
  createListingService,
  deleteListingService,
  getListingsService,
  getOneOfListingsService,
  updateListingService,
} from "./listings.service";
import { Listing } from "./listings.types";

export async function getListingsController(
  req: TypedRequest<{}>,
  res: TypedResponse<any>,
) {
  const filter = buildListingsFilter(req.query);
  const result = await getListingsService(filter);
  res.json(result);
}

export async function getOneOfListingsController(
  req: TypedRequestParams<{ id: string }>,
  res: TypedResponse<any>,
) {
  try {
    const listingId = req.params.id;
    const result = await getOneOfListingsService(listingId);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "Listing not found",
      });
    }

    res.json({
      success: true,
      listing: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

export async function createListingsController(
  req: TypedRequest<Listing>,
  res: TypedResponse<any>,
) {
  const { success, error } = await createListingService(req.body);

  if (!success) {
    return res.status(500).json({ error });
  }

  return res.status(200).json({ message: "have created" });
}

export async function updateListingsController(
  req: TypedRequest<Listing>,
  res: TypedResponse<any>,
) {
  const { success, error } = await updateListingService(req.body);

  if (!success) {
    return res.status(500).json({ error });
  }

  return res.status(200).json({ message: "have updated" });
}

export async function deleteListingsController(
  req: TypedRequestParams<{ id: string }>,
  res: TypedResponse<any>,
) {
  try {
    const listingId = req.params.id;

    if (!listingId) {
      return res.status(400).json({
        success: false,
        error: "Listing ID is required",
      });
    }

    await deleteListingService(listingId);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
