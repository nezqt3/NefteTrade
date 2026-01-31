import { redis } from "../config/redis";
import { JwtPayload } from "../modules/auth/auth.types";
import {
  generateAccessToken,
  generateSecretOfRefreshToken,
} from "../utils/jwt";

export async function saveRefreshToken(
  tokenId: string,
  userId: number,
  role: string,
) {
  await redis.set(`refresh:${tokenId}`, JSON.stringify({ userId, role }), {
    EX: 60 * 60 * 24 * 7,
  });
}

export async function verifyRefreshToken(tokenId: string): Promise<JwtPayload> {
  const data = await redis.get(`refresh:${tokenId}`);

  if (!data) {
    throw new Error("Invalid refresh token");
  }

  return JSON.parse(data) as JwtPayload;
}

export async function revokeRefreshToken(tokenId: string) {
  await redis.del(`refresh:${tokenId}`);
}

export async function setUserOnline(userId: string) {
  await redis.set(`user:${userId}:online`, "1", {
    EX: 60,
  });
}

export async function setUserOffline(userId: string) {
  await redis.del(`user:${userId}:online`);
}

export async function isUserOnline(userId: string) {
  const status = await redis.get(`user:${userId}:online`);
  return status === "1";
}

export async function refreshService(refreshTokenId: string) {
  const data = await redis.get(`refresh:${refreshTokenId}`);

  if (!data) {
    throw new Error("Invalid refresh token");
  }

  revokeRefreshToken(refreshTokenId);

  const { userId, role } = JSON.parse(data);

  const newAccessToken = generateAccessToken({ userId, role });
  const newRefreshToken = generateSecretOfRefreshToken();

  await saveRefreshToken(newRefreshToken, userId, role);

  return {
    access_token: newAccessToken,
    refresh_token: newRefreshToken,
  };
}
