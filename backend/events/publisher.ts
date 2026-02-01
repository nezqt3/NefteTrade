import { redis } from "config/redis";

export async function publishEvent(type: string, payload: any) {
  await redis.xadd(
    "events",
    "*",
    "type",
    type,
    "payload",
    JSON.stringify(payload),
  );
}
