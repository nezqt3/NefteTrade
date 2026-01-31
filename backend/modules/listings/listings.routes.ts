import { Router } from "express";
import {
  createListingsController,
  deleteListingsController,
  getListingsController,
  getOneOfListingsController,
  updateListingsController,
} from "./listings.controller";
import { authMiddleware } from "@modules/auth/auth.middleware";
import { requireRole } from "./listings.permissions";

const router = Router();

/**
 * @swagger
 * /api/v1/ads:
 *   get:
 *     summary: Получить список объявлений
 *     tags:
 *       - Listings
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *         description: Дата начала периода (ISO)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *         description: Дата конца периода (ISO)
 *       - in: query
 *         name: productType
 *         schema:
 *           type: string
 *           enum: [gasoline, diesel, kerosene, lpg, mazut, oil]
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Список объявлений
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Listing'
 */
router.get("/", getListingsController);

/**
 * @swagger
 * api/v1/ads/{id}:
 *   get:
 *     summary: Получить одно объявление по ID
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID объявления
 *     responses:
 *       200:
 *         description: Объявление найдено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 listing:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "abc123"
 *                     ownerId:
 *                       type: string
 *                       example: "user1"
 *                     loadAddress:
 *                       type: string
 *                       example: "Москва"
 *                     unloadAddress:
 *                       type: string
 *                       example: "Санкт-Петербург"
 *                     productType:
 *                       type: string
 *                       example: "diesel"
 *                     quantity:
 *                       type: number
 *                       example: 100
 *                     loadingMethod:
 *                       type: string
 *                       example: "pump"
 *                     pumpRequired:
 *                       type: boolean
 *                       example: true
 *                     price:
 *                       type: number
 *                       example: 500
 *                     status:
 *                       type: string
 *                       example: "active"
 *       404:
 *         description: Объявление не найдено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Listing not found"
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/:id", getOneOfListingsController);

/**
 * @swagger
 * /api/v1/ads:
 *   post:
 *     summary: Создать объявление (только для contractor)
 *     tags:
 *       - Listings
 *     security:
 *       - bearerAuth: []   # если у вас JWT или токен авторизации
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateListing'
 *     responses:
 *       200:
 *         description: Объявление успешно создано
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Listing created successfully
 *       403:
 *         description: Доступ запрещён, только для contractor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Forbidden: only contractors can create listings
 *       500:
 *         description: Ошибка при создании
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.post("/", requireRole("contractor"), createListingsController);

/**
 * @swagger
 * /api/v1/ads/{id}:
 *   patch:
 *     summary: Обновить объявление (только для contractor и admin)
 *     tags:
 *       - Listings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID объявления для обновления
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateListing'
 *     responses:
 *       200:
 *         description: Объявление успешно обновлено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Listing updated successfully
 *       403:
 *         description: Доступ запрещён, только contractor или admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Forbidden: insufficient permissions
 *       404:
 *         description: Объявление не найдено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Listing not found
 *       500:
 *         description: Внутренняя ошибка сервера
 */

router.patch(
  "/:id",
  requireRole("contractor"),
  requireRole("admin"),
  updateListingsController,
);

/**
 * @swagger
 * /api/v1/ads/{id}:
 *   delete:
 *     summary: Удалить объявление (только для contractor и admin)
 *     tags:
 *       - Listings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID объявления для удаления
 *     responses:
 *       200:
 *         description: Объявление успешно удалено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Listing deleted successfully
 *       403:
 *         description: Доступ запрещён, только contractor или admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Forbidden: insufficient permissions
 *       404:
 *         description: Объявление не найдено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Listing not found
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.delete(
  "/:id",
  requireRole("contractor"),
  requireRole("admin"),
  deleteListingsController,
);

export default router;
