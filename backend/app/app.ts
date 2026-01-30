import express from "express";
import { initWebSocket } from "./ws";
import "dotenv/config";
import http from "http";
import { connectRedis } from "../config/redis";

export const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT) || 4000;

initWebSocket(server);
connectRedis()

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
