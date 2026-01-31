import express, { Express } from "express";
import { initWebSocket } from "./ws";
import "dotenv/config";
import http, { Server } from "http";
import { connectRedis } from "../config/redis";
import { initDatabase } from "../database/db.init";
import { setupSwagger } from "../config/swagger";

export const app: Express = express();
const server: Server = http.createServer(app);
const PORT = Number(process.env.PORT) || 4000;

initWebSocket(server);
connectRedis();
setupSwagger(app);

async function bootstrap() {
  await initDatabase();
  server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log("Swagger UI: http://localhost:3000/api-docs");
  });
}

bootstrap();
