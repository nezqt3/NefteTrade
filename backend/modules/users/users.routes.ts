import { Router } from "express";
import {
  getStatusController,
  setUserOnlineController,
} from "./users.controller";

const router = Router();

router.put("/ping", setUserOnlineController);
router.get("/ping", getStatusController);

export default router;
