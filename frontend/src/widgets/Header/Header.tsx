import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@app/store/authStore';
import { UserRole } from '@entities/user/model/types';
import './Header.css';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          OilTransport
        </Link>

        <nav className="nav">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Главная
          </Link>
          <Link 
            to="/ads" 
            className={location.pathname.startsWith('/ads') ? 'nav-link active' : 'nav-link'}
          >
            Объявления
          </Link>
          <Link to="/about" className="nav-link">
            О платформе
          </Link>
        </nav>

        <div className="header-actions">
          {isAuthenticated && user ? (
            <div className="user-menu-container">
              <button 
                className="user-menu-trigger"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar-small">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="user-name-small">{user.name}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {showUserMenu && (
                <>
                  <div className="user-menu-overlay" onClick={() => setShowUserMenu(false)} />
                  <div className="user-menu">
                    <div className="user-menu-header">
                      <div className="user-avatar-large">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="user-menu-name">{user.name}</div>
                        <div className="user-menu-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="user-menu-divider" />
                    <button className="user-menu-item" onClick={() => { navigate('/profile'); setShowUserMenu(false); }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      Профиль
                    </button>
                    <button className="user-menu-item" onClick={() => { navigate('/my-ads'); setShowUserMenu(false); }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      Мои объявления
                    </button>
                    {user.role === UserRole.CONTRACTOR && (
                      <button className="user-menu-item" onClick={() => { navigate('/create-ad'); setShowUserMenu(false); }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Создать объявление
                      </button>
                    )}
                    <div className="user-menu-divider" />
                    <button className="user-menu-item danger" onClick={handleLogout}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Выйти
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <button className="btn btn-outline" onClick={() => navigate('/login')}>
                Войти
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/register')}>
                Начать работу
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
