export interface Payment {
  id: string;
  userId: string;
  adId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'yookassa';
  createdAt: string;
  completedAt?: string;
}

export interface Chat {
  id: string;
  adId: string;
  customerId: string;
  contractorId: string;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  isRead: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  adId: string;
  reviewerId: string;
  reviewedUserId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}
