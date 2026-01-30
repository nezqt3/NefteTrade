import "dotenv/config"
import { SignOptions } from "jsonwebtoken";

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

export const jwtConfig = {
  access: {
    secret: env("JWT_ACCESS_SECRET"),
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
  },
  refresh: {
    secret: env("JWT_REFRESH_SECRET"),
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  },
};