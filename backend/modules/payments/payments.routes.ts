import { Router } from "express";

const router = Router();

router.post("/");
router.post("/unclock/:id");
router.get("/:id");

export default router;
