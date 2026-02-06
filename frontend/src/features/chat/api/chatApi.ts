import { api } from "@shared/api/axios";
import { ChatListItem, Message } from "../model/types";

interface BackendChatItem {
  id: number;
  listingId: number;
  senderId: number;
  receiverId: number;
  created_at: string;
  lastMessage?: Message | null;
  unreadCount: number;
}

function mapChat(item: BackendChatItem): ChatListItem {
  return {
    id: String(item.id),
    listingId: String(item.listingId),
    senderId: String(item.senderId),
    receiverId: String(item.receiverId),
    createdAt: item.created_at,
    lastMessage: item.lastMessage ?? null,
    unreadCount: item.unreadCount ?? 0,
  };
}

export const chatApi = {
  getMyChats: async (): Promise<ChatListItem[]> => {
    const response = await api.get<BackendChatItem[]>("/chats");
    return response.data.map(mapChat);
  },
};
