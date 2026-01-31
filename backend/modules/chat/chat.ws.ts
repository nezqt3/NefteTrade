import { Server } from "socket.io";
import { Message } from "./chat.types";
import { markMessagesAsReadInDB, sendMessageService } from "./chat.service";

const onlineUsers: Record<string, string> = {};

export function initWsRouter(io: Server) {
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    const { userId } = socket.handshake.query as { userId: string };

    if (userId) {
      onlineUsers[userId] = socket.id;

      io.emit("userStatusChange", { userId, online: true });
    }

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

      if (userId && onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];

        io.emit("userStatusChange", { userId, online: false });
      }
    });
  });
}
