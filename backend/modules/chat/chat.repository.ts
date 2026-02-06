import { dbProvider, query } from "../../config/database";
import { Chat, Message } from "./chat.types";

function mapMessageRow(row: any): Message {
  return {
    id: Number(row.id),
    chatId: Number(row.chat_id),
    message: row.message,
    senderId: Number(row.sender_id),
    created_at:
      typeof row.created_at === "string"
        ? Date.parse(row.created_at)
        : Number(row.created_at),
    read: row.read === true || row.read === 1,
  };
}

function mapChatRow(row: any): Chat {
  return {
    id: Number(row.id),
    listingId: Number(row.listing_id),
    senderId: Number(row.sender_id),
    receiverId: Number(row.receiver_id),
    created_at: row.created_at ?? new Date().toISOString(),
  };
}

export async function getMessages(chatId: number) {
  try {
    const sql =
      "SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC, id ASC";
    const values = [chatId];
    const result = await query<any>(sql, values);

    return result.rows.map(mapMessageRow);
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}

export async function sendMessage(message: Message): Promise<Message> {
  try {
    const sql =
      "INSERT INTO messages (chat_id, message, sender_id, created_at, read) VALUES ($1, $2, $3, $4, $5)";
    const createdAtIso = new Date(
      message.created_at ?? Date.now(),
    ).toISOString();
    const values = [
      message.chatId,
      message.message,
      message.senderId,
      createdAtIso,
      message.read,
    ];
    await query(sql, values);

    let id = 0;
    if (dbProvider === "sqlite") {
      const result = await query<{ id: number }>(
        "SELECT last_insert_rowid() as id",
      );
      id = Number(result.rows[0]?.id ?? 0);
    } else {
      const result = await query<{ id: number }>(
        "SELECT currval(pg_get_serial_sequence('messages','id')) as id",
      );
      id = Number(result.rows[0]?.id ?? 0);
    }

    const inserted = await query<any>("SELECT * FROM messages WHERE id = $1", [
      id,
    ]);
    return mapMessageRow(inserted.rows[0]);
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export async function getChatById(chatId: number): Promise<Chat | null> {
  const { rows } = await query<any>("SELECT * FROM chats WHERE id = $1", [
    chatId,
  ]);
  return rows[0] ? mapChatRow(rows[0]) : null;
}

export async function findChatByListingAndUsers(
  listingId: number,
  userA: number,
  userB: number,
): Promise<Chat | null> {
  const { rows } = await query<any>(
    `
    SELECT * FROM chats
    WHERE listing_id = $1
      AND (
        (sender_id = $2 AND receiver_id = $3)
        OR
        (sender_id = $3 AND receiver_id = $2)
      )
    LIMIT 1
    `,
    [listingId, userA, userB],
  );
  return rows[0] ? mapChatRow(rows[0]) : null;
}

export async function createChat(
  listingId: number,
  senderId: number,
  receiverId: number,
): Promise<Chat> {
  const createdAt = new Date().toISOString();
  await query(
    `
    INSERT INTO chats (listing_id, sender_id, receiver_id, created_at)
    VALUES ($1, $2, $3, $4)
  `,
    [listingId, senderId, receiverId, createdAt],
  );

  let id = 0;
  if (dbProvider === "sqlite") {
    const result = await query<{ id: number }>(
      "SELECT last_insert_rowid() as id",
    );
    id = Number(result.rows[0]?.id ?? 0);
  } else {
    const result = await query<{ id: number }>(
      "SELECT currval(pg_get_serial_sequence('chats','id')) as id",
    );
    id = Number(result.rows[0]?.id ?? 0);
  }

  const chat = await getChatById(id);
  if (!chat) {
    throw new Error("Chat not created");
  }
  return chat;
}

export async function getOrCreateChat(
  listingId: number,
  userA: number,
  userB: number,
): Promise<Chat> {
  const existing = await findChatByListingAndUsers(listingId, userA, userB);
  if (existing) return existing;
  return createChat(listingId, userA, userB);
}

export async function getChatsByUser(userId: number) {
  const { rows } = await query<any>(
    `
    SELECT * FROM chats
    WHERE sender_id = $1 OR receiver_id = $1
    ORDER BY created_at DESC
  `,
    [userId],
  );

  const chats = rows.map(mapChatRow);

  const enriched = await Promise.all(
    chats.map(async (chat) => {
      const lastMessageRes = await query<any>(
        `
        SELECT * FROM messages
        WHERE chat_id = $1
        ORDER BY created_at DESC, id DESC
        LIMIT 1
      `,
        [chat.id],
      );
      const lastMessage = lastMessageRes.rows[0]
        ? mapMessageRow(lastMessageRes.rows[0])
        : null;

      const unreadRes = await query<{ count: number }>(
        `
        SELECT COUNT(*) as count
        FROM messages
        WHERE chat_id = $1 AND read = false AND sender_id <> $2
      `,
        [chat.id, userId],
      );
      const unreadCount = Number(unreadRes.rows[0]?.count ?? 0);

      return {
        ...chat,
        lastMessage,
        unreadCount,
      };
    }),
  );

  return enriched;
}

export async function markMessage(messageIds: number[]) {
  try {
    const sql = "UPDATE messages SET read = true WHERE id = ANY($1)";
    const values = [messageIds];
    await query(sql, values);
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
}
