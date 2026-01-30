import jwt from 'jsonwebtoken'
import { JwtPayload } from '../modules/auth/auth.types';
import { jwtConfig } from '../config/jwt'
import crypto from "crypto";

export function generateAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, jwtConfig.access.secret, {
    expiresIn: jwtConfig.access.expiresIn,
  });
}

export function generateSecretOfRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}