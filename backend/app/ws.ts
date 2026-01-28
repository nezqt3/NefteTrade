import { WebSocketServer } from "ws";

export function initWebSocket(server) {
    const wss = new WebSocketServer({ server });
    initWsRouter(wss)
}