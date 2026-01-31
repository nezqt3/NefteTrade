import { Router } from "express";
import {
  getStatusController,
  setUserOnlineController,
} from "./users.controller";
import { authMiddleware } from "@modules/auth/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/v1/users/ping:
 *   put:
 *     summary: Heartbeat пользователя (установить online)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Пользователь помечен как online
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User online
 *       401:
 *         description: Unauthorized
 */
router.put("/ping", authMiddleware, setUserOnlineController);

/**
 * @swagger
 * /api/v1/users/status:
 *   get:
 *     summary: Получить статус пользователя (online / offline)
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: number
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Статус пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 online:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Некорректный userId
 *       500:
 *         description: Internal server error
 */
router.get("/status", getStatusController);

export default router;
