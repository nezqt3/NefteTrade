import { authService } from './auth.service';
import { TypedRequest, TypedResponse } from '../../shared/http';
import {AuthRequest, AuthResponse } from './auth.types'

export async function authController(req: TypedRequest<AuthRequest>, res: TypedResponse<AuthResponse>) {
    const result = await authService(req.body)
    res.json(result)
}

export async function registerController(req: TypedRequest<AuthRequest>, res: TypedResponse<AuthResponse>) {
    const result = await authService(req.body)
    res.json(result)
}