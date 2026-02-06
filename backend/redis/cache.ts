import { Role } from "shared/constants";
import { redis } from "../config/redis";
import { JwtPayload } from "../modules/auth/auth.types";

type MemoryToken = { userId: number; role: string; expiresAt: number };
const memoryTokens = new Map<string, MemoryToken>();
const REFRESH_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function isRedisReady() {
  return redis.isOpen;
}

export async function saveRefreshToken(
  tokenId: string,
  userId: number,
  role: string,
) {
  if (isRedisReady()) {
    await redis.set(`refresh:${tokenId}`, JSON.stringify({ userId, role }), {
      EX: 60 * 60 * 24 * 7,
    });
    return;
  }

  memoryTokens.set(tokenId, {
    userId,
    role,
    expiresAt: Date.now() + REFRESH_TTL_MS,
  });
}

export async function verifyRefreshToken(tokenId: string): Promise<JwtPayload> {
  if (isRedisReady()) {
    const data = await redis.get(`refresh:${tokenId}`);
    if (!data) {
      throw new Error("Invalid refresh token");
    }
    return JSON.parse(data) as JwtPayload;
  }

  const token = memoryTokens.get(tokenId);
  if (!token || token.expiresAt <= Date.now()) {
    memoryTokens.delete(tokenId);
    throw new Error("Invalid refresh token");
  }
  const role: Role = token.role as Role;
  return { userId: token.userId, role: role };
}

export async function revokeRefreshToken(tokenId: string) {
  if (isRedisReady()) {
    await redis.del(`refresh:${tokenId}`);
    return;
  }
  memoryTokens.delete(tokenId);
}

export async function setUserOnline(userId: string) {
  if (!isRedisReady()) return;
  await redis.set(`user:${userId}:online`, "1", { EX: 60 });
}

export async function setUserOffline(userId: string) {
  if (!isRedisReady()) return;
  await redis.del(`user:${userId}:online`);
}

export async function isUserOnline(userId: string) {
  if (!isRedisReady()) return false;
  const status = await redis.get(`user:${userId}:online`);
  return status === "1";
}
