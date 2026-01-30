import { api } from '@shared/api/axios';
import { Ad, AdFilters, CreateAdDto } from '@entities/ad/model/types';

export interface AdsResponse {
  ads: Ad[];
  total: number;
  page: number;
  limit: number;
}

export const adsApi = {
  getAds: async (
    filters: AdFilters = {},
    page = 1,
    limit = 20
  ): Promise<AdsResponse> => {
    const response = await api.get<AdsResponse>('/ads', {
      params: { ...filters, page, limit },
    });
    return response.data;
  },

  getAdById: async (id: string): Promise<Ad> => {
    const response = await api.get<Ad>(`/ads/${id}`);
    return response.data;
  },

  createAd: async (data: CreateAdDto): Promise<Ad> => {
    const response = await api.post<Ad>('/ads', data);
    return response.data;
  },

  updateAd: async (id: string, data: Partial<CreateAdDto>): Promise<Ad> => {
    const response = await api.patch<Ad>(`/ads/${id}`, data);
    return response.data;
  },

  deleteAd: async (id: string): Promise<void> => {
    await api.delete(`/ads/${id}`);
  },

  getMyAds: async (): Promise<Ad[]> => {
    const response = await api.get<Ad[]>('/ads/my');
    return response.data;
  },
};
