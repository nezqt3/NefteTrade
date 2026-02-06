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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin === process.env.CORS_ORIGIN) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

initWebSocket(server);
connectRedis();
setupSwagger(app);
require("./router");

async function bootstrap() {
  await initDatabase();
  server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log("Swagger UI: http://localhost:3000/api-docs");
  });
}

bootstrap();
