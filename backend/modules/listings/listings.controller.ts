import { TypedRequest, TypedResponse } from "../../shared/http";
import { buildListingsFilter } from "./listings.filter";
import { createListingService, getListingsService } from "./listings.service";
import { Listing } from "./listings.types";

export async function getListingsController(
  req: TypedRequest<{}>,
  res: TypedResponse<any>,
) {
  const filter = buildListingsFilter(req.query);
  const result = await getListingsService(filter);
  res.json(result);
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
