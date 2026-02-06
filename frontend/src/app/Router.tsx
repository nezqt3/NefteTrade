import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { Header } from '@widgets/Header/Header';
import { HomePage } from '@pages/HomePage/HomePage';
import { LoginPage } from '@pages/LoginPage/LoginPage';
import { RegisterPage } from '@pages/RegisterPage/RegisterPage';
import { AdsListPage } from '@pages/AdsListPage/AdsListPage';
import { AdDetailPage } from '@pages/AdDetailPage/AdDetailPage';
import { CreateAdPage } from '@pages/CreateAdPage/CreateAdPage';
import { MyAdsPage } from '@pages/MyAdsPage/MyAdsPage';
import { ChatPage } from '@pages/ChatPage/ChatPage';
import { useAuthStore } from '@app/store/authStore';

const { Footer } = Layout;

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Routes>
          {/* Public routes without header */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Routes with header */}
          <Route
            path="/*"
            element={
              <>
                <Header />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/ads" element={<AdsListPage />} />
                  <Route path="/ads/:id" element={<AdDetailPage />} />
                  
                  {/* Protected routes */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <div style={{ padding: '50px', textAlign: 'center' }}>
                          <h1>Профиль (в разработке)</h1>
                        </div>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-ads"
                    element={
                      <ProtectedRoute>
                        <MyAdsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-ad"
                    element={
                      <ProtectedRoute>
                        <CreateAdPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/messages"
                    element={
                      <ProtectedRoute>
                        <ChatPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/messages/:id"
                    element={
                      <ProtectedRoute>
                        <ChatPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
                <Footer style={{ textAlign: 'center', background: '#f5f5f5' }}>
                  OilTransport ©{new Date().getFullYear()} Платформа для перевозки нефтепродуктов
                </Footer>
              </>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};
