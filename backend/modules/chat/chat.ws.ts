import { Server } from "socket.io";
import { Message } from "./chat.types";
import { sendMessageService } from "./chat.service";

export function initWsRouter(io: Server) {
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("joinChat", (chatId: string) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat ${chatId}`);
    });

    socket.on("sendMessage", async (message: Message) => {
      message.created_at = Date.now();

      await sendMessageService(message);

      io.to(message.chatId.toString()).emit("newMessage", message);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}
