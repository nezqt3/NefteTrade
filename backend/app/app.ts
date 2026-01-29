import express from "express";
import { initWebSocket } from "./ws";
import "dotenv/config";
import http from "http";

const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT);

initWebSocket(server);

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
