import express from "express";
import { initWebSocket } from "./ws";
import "dotenv/config";
import http from "http";
import { connectRedis } from "../config/redis";
import { initDatabase } from "../database/db.init";

export const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT) || 4000;

initWebSocket(server);
connectRedis();

async function bootstrap() {
  await initDatabase();
  server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

bootstrap();
