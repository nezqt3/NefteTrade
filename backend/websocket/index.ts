// websocket/index.ts
import { chatWs } from "../modules/chat/chat.ws";
import { notificationsWs } from "../modules/notifications/notifications.ws";

export function initWsRouter(wss) {
  wss.on("connection", (ws, req) => {
    ws.on("message", async (raw) => {
      let message;

      try {
        message = JSON.parse(raw.toString());
      } catch {
        return ws.send(JSON.stringify({ error: "Invalid JSON" }));
      }

      const { event, payload } = message;

      switch (event) {
        case "chat.send":
          await chatWs.sendMessage(ws, payload);
          break;

        case "notify.subscribe":
          await notificationsWs.subscribe(ws, payload);
          break;

        default:
          ws.send(JSON.stringify({ error: "Unknown event" }));
      }
    });
  });
}
