export interface Chat {
  id: number;
  listingId: number;
  senderId: number;
  receiverId: string;
  created_at: Date;
}

export interface Message {
  id: number;
  chatId: number;
  message: string;
  senderId: number;
  created_at: number;
  read: boolean;
}
