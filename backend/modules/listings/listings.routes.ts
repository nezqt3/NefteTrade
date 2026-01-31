import { Router } from "express";
import {
  createListingsController,
  getListingsController,
} from "./listings.controller";
import { authMiddleware } from "@modules/auth/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/v1/listings:
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
router.get("/listings", getListingsController);

/**
 * @swagger
 * /api/v1/listings:
 *   post:
 *     summary: Создать объявление
 *     tags:
 *       - Listings
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
 *                   example: have created
 *       500:
 *         description: Ошибка при создании
 */
router.post("/listings", createListingsController);

export default router;
