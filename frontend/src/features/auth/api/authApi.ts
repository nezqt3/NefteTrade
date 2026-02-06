import { api } from '@shared/api/axios';
import { User, UserRole, VerificationStatus } from '@entities/user/model/types';

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
  refreshToken?: string;
}

interface BackendUser {
  id: number;
  email: string;
  login: string;
  numberPhone: string;
  data: string;
  role: UserRole;
  last_online?: string;
  confirmed?: boolean;
  created_at?: string;
}

interface BackendAuthResponse {
  access_token: string;
  refresh_token: string;
  user: BackendUser;
}

function mapUser(user: BackendUser): User {
  const isVerified = !!user.confirmed;
  return {
    id: String(user.id),
    role: user.role,
    name: user.data || user.login,
    phone: user.numberPhone,
    email: user.email,
    isVerified,
    verificationStatus: isVerified
      ? VerificationStatus.APPROVED
      : VerificationStatus.PENDING,
    rating: 0,
    createdAt: user.created_at || new Date().toISOString(),
    avatar: undefined,
  };
}

function mapAuthResponse(data: BackendAuthResponse): AuthResponse {
  return {
    user: mapUser(data.user),
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
}

export const authApi = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<BackendAuthResponse>('/auth/login', {
      login: data.email,
      email: data.email,
      password: data.password,
    });
    return mapAuthResponse(response.data);
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post<BackendAuthResponse>('/auth/register', {
      email: data.email,
      login: data.email,
      password: data.password,
      numberPhone: data.phone,
      data: data.name,
      role: data.role,
    });
    return mapAuthResponse(response.data);
  },

  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await api.post('/auth/logout', { refresh_token: refreshToken });
    }
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<{ user: BackendUser }>('/auth/me');
    return mapUser(response.data.user);
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('Refresh token missing');
    }
    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return {
      accessToken: response.data.access_token,
    };
  },
};
