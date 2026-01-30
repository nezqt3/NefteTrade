import { api } from '@shared/api/axios';
import { Payment } from '@entities/payment/model/types';

export interface CreatePaymentDto {
  adId: string;
}

export interface PaymentResponse {
  payment: Payment;
  confirmationUrl?: string;
}

export const paymentApi = {
  createPayment: async (data: CreatePaymentDto): Promise<PaymentResponse> => {
    const response = await api.post<PaymentResponse>('/payments', data);
    return response.data;
  },

  getPaymentStatus: async (paymentId: string): Promise<Payment> => {
    const response = await api.get<Payment>(`/payments/${paymentId}`);
    return response.data;
  },

  getMyPayments: async (): Promise<Payment[]> => {
    const response = await api.get<Payment[]>('/payments/my');
    return response.data;
  },

  unlockContact: async (adId: string): Promise<{ phone: string }> => {
    const response = await api.post<{ phone: string }>(`/payments/unlock/${adId}`);
    return response.data;
  },
};
