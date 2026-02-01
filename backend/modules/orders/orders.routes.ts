import { Router } from "express";
import { OrdersController } from "./orders.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Управление заказами
 */

/**
 * @swagger
 * /orders/user/{userId}:
 *   get:
 *     summary: Получить все заказы пользователя
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Список заказов пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 stats:
 *                   type: object
 *                   properties:
 *                     asCustomer:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                         avgRate:
 *                           type: number
 *                     asReceiver:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                         avgRate:
 *                           type: number
 */
router.get("/user/:userId", OrdersController.getUserOrders);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Создать заказ
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Заказ успешно создан
 */
router.post("/", OrdersController.createOrder);

/**
 * @swagger
 * /orders/{orderId}:
 *   delete:
 *     summary: Удалить заказ
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID заказа
 *     responses:
 *       200:
 *         description: Заказ успешно удалён
 */
router.delete("/:orderId", OrdersController.deleteOrder);

/**
 * @swagger
 * /orders/{orderId}/status:
 *   patch:
 *     summary: Обновить статус заказа
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID заказа
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Новый статус заказа
 *     responses:
 *       200:
 *         description: Статус заказа обновлён
 */
router.patch("/:orderId/status", OrdersController.updateStatus);

/**
 * @swagger
 * /orders/{orderId}/rate:
 *   patch:
 *     summary: Установить оценку для заказа
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID заказа
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rate:
 *                 type: integer
 *                 description: Оценка заказа
 *     responses:
 *       200:
 *         description: Оценка успешно установлена
 */
router.patch("/:orderId/rate", OrdersController.setRate);

export default router;
