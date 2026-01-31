import { pool } from "../../config/database";
import { Message } from "./chat.types";

export async function getMessages(chatId: number) {
  try {
    const query = "SELECT * FROM messages WHERE chat_id = $1";
    const values = [chatId];
    const result = await pool.query<Message[]>(query, values);

    return result.rows;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}

export async function sendMessage(message: Message) {
  try {
    const query =
      "INSERT INTO messages (chat_id, message, sender_id, created_at, read) VALUES ($1, $2, $3, $4, $5s)";
    const values = [
      message.chatId,
      message.message,
      message.senderId,
      message.created_at,
      message.read,
    ];
    await pool.query(query, values);
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}
