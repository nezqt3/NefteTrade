import { Server as SocketIOServer } from "socket.io";
import { Server } from "http";
import { initWsRouter } from "../config/websocket";

export function initWebSocket(server: Server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
    },
  });

  initWsRouter(io);
}
