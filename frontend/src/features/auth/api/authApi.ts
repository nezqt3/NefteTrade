import { api } from '@shared/api/axios';
import { User, UserRole } from '@entities/user/model/types';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export const authApi = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};
