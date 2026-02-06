import { api } from '@shared/api/axios';
import { Payment } from '@entities/payment/model/types';

export interface CreatePaymentDto {
  adId: string;
}

interface BackendPayment {
  id: number;
  listingId: number;
  userId: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface PaymentResponse {
  payment: Payment;
  confirmationUrl?: string;
}

function mapPayment(payment: BackendPayment): Payment {
  return {
    id: String(payment.id),
    userId: String(payment.userId),
    adId: String(payment.listingId),
    amount: payment.amount,
    status: payment.status,
    paymentMethod: 'card',
    createdAt: payment.createdAt,
    completedAt: payment.status === 'completed' ? payment.createdAt : undefined,
  };
}

export const paymentApi = {
  createPayment: async (data: CreatePaymentDto): Promise<PaymentResponse> => {
    const response = await api.post<{ payment: BackendPayment }>('/payments', {
      adId: data.adId,
    });
    return { payment: mapPayment(response.data.payment) };
  },

  getPaymentStatus: async (paymentId: string): Promise<Payment> => {
    const response = await api.get<BackendPayment>(`/payments/${paymentId}`);
    return mapPayment(response.data);
  },

  getMyPayments: async (): Promise<Payment[]> => {
    const response = await api.get<BackendPayment[]>('/payments/my');
    return response.data.map(mapPayment);
  },

  unlockContact: async (
    adId: string,
  ): Promise<{ phone: string; chatId: number }> => {
    const response = await api.post<{ phone: string; chatId: number }>(
      `/payments/unlock/${adId}`,
    );
    return response.data;
  },
};
