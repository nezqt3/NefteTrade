export interface Message {
  id?: number;
  chatId: string | number;
  message: string;
  senderId: string | number;
  created_at: number;
  read: boolean;
}

export interface ChatListItem {
  id: string;
  listingId: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  lastMessage?: Message | null;
  unreadCount: number;
}
