import React from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from '@widgets/Header/Header';
import { HomePage } from '@pages/HomePage/HomePage';
import { LoginPage } from '@pages/LoginPage/LoginPage';
import { RegisterPage } from '@pages/RegisterPage/RegisterPage';
import { AdsListPage } from '@pages/AdsListPage/AdsListPage';
import { AdDetailPage } from '@pages/AdDetailPage/AdDetailPage';
import { CreateAdPage } from '@pages/CreateAdPage/CreateAdPage';
import { MyAdsPage } from '@pages/MyAdsPage/MyAdsPage';
import { ChatPage } from '@pages/ChatPage/ChatPage';
import { AboutPage } from '@pages/AboutPage/AboutPage';
import { useAuthStore } from '@app/store/authStore';
import { Footer } from '@widgets/Footer/Footer';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/messages');

  return (
    <div className="tg-app">
      <div className="tg-app__background" aria-hidden="true">
        <div className="tg-app__blob tg-app__blob--blue" />
        <div className="tg-app__blob tg-app__blob--accent" />
      </div>

      <Header />

      <main className={isChatPage ? 'tg-main tg-main--chat' : 'tg-main'}>
        <Outlet />
      </main>

      {!isChatPage && <Footer />}
    </div>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="ads" element={<AdsListPage />} />
          <Route path="ads/:id" element={<AdDetailPage />} />
          <Route path="about" element={<AboutPage />} />

          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <main className="tg-page">
                  <div className="tg-container">
                    <section className="tg-card" style={{ padding: '28px', textAlign: 'center' }}>
                      <h1>Профиль в разработке</h1>
                    </section>
                  </div>
                </main>
              </ProtectedRoute>
            }
          />

          <Route
            path="my-ads"
            element={
              <ProtectedRoute>
                <MyAdsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="create-ad"
            element={
              <ProtectedRoute>
                <CreateAdPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="messages"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="messages/:id"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
