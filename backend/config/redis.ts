import { createClient } from "redis";

export const redis = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
  password: process.env.REDIS_PASSWORD || undefined,
  database: Number(process.env.REDIS_DB || 0),
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err: Error) => {
  console.error("Redis error", err);
});

export async function connectRedis() {
  if (!redis.isOpen) {
    try {
      await redis.connect();
    } catch (err) {
      console.error("Redis connection failed, continuing without Redis", err);
    }
  }
}
