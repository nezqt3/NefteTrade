import { Router } from "express";
import {
  createListingsController,
  getListingsController,
} from "./listings.controller";

const router = Router();

router.get("/listings", getListingsController);
router.post("/listings", createListingsController);

export default router;
