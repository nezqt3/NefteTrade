import { Server } from "socket.io";

export function initWsRouter(wss: Server) {
  wss.on("connection", (socket) => {
    socket.on("event", (data) => {
      socket.send(`yep, ${data}`);
    });

    socket.on("disconnect", () => {
      console.log("WS client disconnected");
    });
  });
}
