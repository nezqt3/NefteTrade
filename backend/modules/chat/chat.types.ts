export interface Chat {
  id: number;
  listingId: number;
  senderId: number;
  receiverId: number;
  created_at: string;
}

export interface Message {
  id: number;
  chatId: number;
  message: string;
  senderId: number;
  created_at: number;
  read: boolean;
}
