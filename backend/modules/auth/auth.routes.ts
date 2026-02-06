import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware, roleMiddleware } from "./auth.middleware";
import { getUserById } from "../users/users.repository";

const router = Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *   get:
 *     summary: Логин пользователя
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: login
 *         schema:
 *           type: string
 *         required: true
 *         description: Логин пользователя
 *       - in: query
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *         description: Пароль пользователя
 *     responses:
 *       200:
 *         description: Пользователь успешно авторизован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     login:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Ошибка валидации или неверный логин/пароль
 */
router.post("/login", AuthController.authController);

/**
 * @swagger
 * /api/v1/auth/register:
 *   get:
 *     summary: Регистрация нового пользователя
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email пользователя
 *       - in: query
 *         name: login
 *         schema:
 *           type: string
 *         required: true
 *         description: Логин пользователя
 *       - in: query
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *         description: Пароль пользователя
 *       - in: query
 *         name: numberPhone
 *         schema:
 *           type: string
 *         required: true
 *         description: Номер телефона
 *       - in: query
 *         name: data
 *         schema:
 *           type: string
 *         required: false
 *         description: Любые дополнительные данные
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         required: false
 *         description: Роль пользователя (по умолчанию customer)
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     login:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Ошибка валидации или не удалось создать пользователя
 */
router.post("/register", AuthController.registerController);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   get:
 *     summary: Выход пользователя (инвалидация refresh токена)
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: refreshToken
 *         schema:
 *           type: string
 *         required: true
 *         description: Refresh токен для выхода
 *     responses:
 *       200:
 *         description: Пользователь успешно вышел
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 */
router.post("/logout", AuthController.logoutController);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Получение информации о текущем пользователе
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Информация о пользователе
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     login:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Неавторизованный пользователь
 */
router.get("/me", authMiddleware, async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const user = await getUserById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
});

/**
 * @swagger
 * /api/v1/auth/public:
 *   get:
 *     summary: Публичный эндпоинт
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/public", (req, res) => res.json({ message: "Public endpoint" }));

/**
 * @swagger
 * /api/v1/auth/admin:
 *   get:
 *     summary: Приватный эндпоинт для администраторов
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Доступ к админским данным
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 secret:
 *                   type: string
 *       401:
 *         description: Неавторизованный
 *       403:
 *         description: Доступ запрещен (не админ)
 */
router.get("/admin", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.json({ secret: "admin stuff" });
});

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Обновление access и refresh токенов
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 description: Действующий refresh токен
 *     responses:
 *       200:
 *         description: Токены успешно обновлены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *       401:
 *         description: Некорректный или истёкший refresh токен
 */
router.post("/refresh", AuthController.refreshTokenController);

export default router;
