import { WebSocketServer } from "ws";
import { Server } from "http";
import { initWsRouter } from "../websocket";

export function initWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });
  initWsRouter(wss);
}
