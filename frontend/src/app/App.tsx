import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './Router';
import { antdTheme } from '@shared/config/theme';
import { useAuthStore } from './store/authStore';
import { authApi } from '@features/auth/api/authApi';
import ruRU from 'antd/locale/ru_RU';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const user = await authApi.getCurrentUser();
          setUser(user);
        } catch (error) {
          localStorage.removeItem('accessToken');
          setUser(null);
        }
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser, setLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antdTheme} locale={ruRU}>
        <AppRouter />
      </ConfigProvider>
    </QueryClientProvider>
  );
};
