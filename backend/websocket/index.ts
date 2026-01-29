import { WebSocketServer } from "ws";

export function initWsRouter(wss: WebSocketServer) {
  wss.on("connection", (socket) => {
    socket.on("message", (message) => {
      socket.send(`yep, ${message}`);
    });

    socket.on("close", () => {
      console.log("WS client disconnected");
    });
  });
}
