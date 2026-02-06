import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";
import { getMyChatsController } from "./chat.controller";

const router = Router();

router.get("/", authMiddleware, getMyChatsController);

export default router;
