import { Router } from 'express';
import { authController, registerController } from './auth.controller';
import { authMiddleware, roleMiddleware } from './auth.middleware';
import { revokeRefreshToken } from '../../redis/cache';

const router = Router();

router.get('/login', authController);
router.get("/register", registerController)
router.get("/logout", revokeRefreshToken)

router.get('/me', authMiddleware, (req, res) => {
    res.json({user: req.user})
})

router.get("/public", (req, res) => res.json({ message: "Public endpoint" }))

router.get("/admin", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.json({ secret: "admin stuff" });
});

export default router