import { getMessages, markMessage, sendMessage } from "./chat.repository";
import { Message } from "./chat.types";

export async function getMessagesService(chatId: number) {
  const rows = await getMessages(chatId);

  if (rows.length === 0) {
    throw new Error("No messages found for this chat");
  }

  return rows;
}

export async function sendMessageService(message: Message) {
  await sendMessage(message);
}

export async function markMessagesAsReadInDB(messageIds: number[]) {
  await markMessage(messageIds);
}
