import { Server } from "socket.io";
import { Message } from "./chat.types";
import { markMessagesAsReadInDB, sendMessageService } from "./chat.service";

export function initWsRouter(io: Server) {
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("joinChat", (chatId: string) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat ${chatId}`);
    });

    socket.on("sendMessage", async (message: Message) => {
      message.created_at = Date.now();
      message.read = false;

      await sendMessageService(message);

      io.to(message.chatId.toString()).emit("newMessage", message);
    });

    socket.on("markAsRead", async ({ chatId, messageIds, userId }) => {
      await markMessagesAsReadInDB(messageIds);

      socket.to(chatId).emit("messagesRead", { messageIds, userId });
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}
