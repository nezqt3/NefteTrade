import { Server } from "socket.io";
import {
  getMessages,
  markMessage,
  sendMessage,
} from "../modules/chat/chat.repository";

type JoinPayload = { chatId: string | number; userId: string | number };
type SendPayload = {
  chatId: string | number;
  message: string;
  senderId: string | number;
  created_at?: number;
};
type ReadPayload = {
  chatId: string | number;
  messageIds: number[];
  userId: string | number;
};

export function initWsRouter(wss: Server) {
  wss.on("connection", (socket) => {
    socket.on("joinChat", async (payload: JoinPayload) => {
      const chatId = Number(payload?.chatId);
      if (!chatId) return;
      const room = `chat:${chatId}`;
      socket.join(room);

      try {
        const messages = await getMessages(chatId);
        socket.emit("chatHistory", { chatId, messages });
      } catch (err) {
        console.error("WS chatHistory error", err);
      }
    });

    socket.on("sendMessage", async (payload: SendPayload, ack?: Function) => {
      try {
        const chatId = Number(payload?.chatId);
        const senderId = Number(payload?.senderId);
        const text = payload?.message?.trim();

        if (!chatId || !senderId || !text) return;

        const saved = await sendMessage({
          chatId,
          senderId,
          message: text,
          created_at: payload.created_at ?? Date.now(),
          read: false,
          id: 0,
        });

        wss.to(`chat:${chatId}`).emit("newMessage", saved);
        if (ack) ack(saved);
      } catch (err) {
        console.error("WS sendMessage error", err);
        if (ack) ack({ error: "sendMessage failed" });
      }
    });

    socket.on("markAsRead", async (payload: ReadPayload) => {
      try {
        const chatId = Number(payload?.chatId);
        if (!chatId || !payload?.messageIds?.length) return;
        await markMessage(payload.messageIds);
        wss.to(`chat:${chatId}`).emit("messagesRead", {
          chatId,
          messageIds: payload.messageIds,
          userId: payload.userId,
        });
      } catch (err) {
        console.error("WS markAsRead error", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("WS client disconnected");
    });
  });
}
