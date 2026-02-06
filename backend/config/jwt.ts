import "dotenv/config";
import { SignOptions } from "jsonwebtoken";

const isProd = process.env.NODE_ENV === "production";

function env(name: string, fallback: string): string {
  const value = process.env[name];
  if (value) return value;
  if (isProd) throw new Error(`Missing env: ${name}`);
  console.warn(`[jwt] Missing ${name}, using fallback value for dev`);
  return fallback;
}

export const jwtConfig = {
  access: {
    secret: env(
      "JWT_ACCESS_SECRET",
      process.env.ACCESS_TOKEN_SECRET ?? "dev-access-secret",
    ),
    expiresIn:
      (process.env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"]) ?? "15m",
  },
  refresh: {
    secret: env(
      "JWT_REFRESH_SECRET",
      process.env.REFRESH_TOKEN_SECRET ?? "dev-refresh-secret",
    ),
    expiresIn:
      (process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]) ?? "7d",
  },
};
