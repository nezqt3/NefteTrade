import { Router } from 'express';
import { authController, registerController } from './auth.controller';

const router = Router();

router.get('/login', authController);
router.get("/register", registerController)

export default router