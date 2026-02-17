import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useAuthStore } from '@app/store/authStore';
import { UserRole } from '@entities/user/model/types';
import { switchPage } from '@shared/lib/switchPage';
import './Header.css';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    setShowUserMenu(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    switchPage(navigate, '/login');
  };

  return (
    <header className="tg-header" aria-label="Основная навигация">
      <div className="tg-container tg-header__container">
        <Link to="/" className="tg-header__logo logo" aria-label="ТрансГарант - на главную">
          ТрансГарант
        </Link>

        <nav className="tg-header__nav" aria-label="Навигация по сайту">
          <Link to="/" className={location.pathname === '/' ? 'tg-header__link tg-header__link--active' : 'tg-header__link'}>
            Главная
          </Link>
          <Link
            to="/ads"
            className={location.pathname.startsWith('/ads') ? 'tg-header__link tg-header__link--active' : 'tg-header__link'}
          >
            Объявления
          </Link>
          <Link
            to="/about"
            className={location.pathname.startsWith('/about') ? 'tg-header__link tg-header__link--active' : 'tg-header__link'}
          >
            О нас
          </Link>
        </nav>

        <div className="tg-header__actions">
          {isAuthenticated && user ? (
            <div className="tg-user-menu">
              <button
                className="tg-user-menu__trigger"
                aria-label="Открыть меню пользователя"
                onClick={() => setShowUserMenu((prev) => !prev)}
                type="button"
              >
                <span className="tg-user-menu__avatar">{user.name.charAt(0).toUpperCase()}</span>
                <span className="tg-user-menu__name">{user.name}</span>
                <ChevronDown className="tg-user-menu__chevron" size={16} strokeWidth={2.4} />
              </button>

              {showUserMenu && (
                <>
                  <button
                    className="tg-user-menu__overlay"
                    aria-label="Закрыть меню"
                    onClick={() => setShowUserMenu(false)}
                    type="button"
                  />
                  <div className="tg-user-menu__panel">
                    <div className="tg-user-menu__info">
                      <span className="tg-user-menu__avatar tg-user-menu__avatar--large">{user.name.charAt(0).toUpperCase()}</span>
                      <div>
                        <p className="tg-user-menu__title">{user.name}</p>
                        <p className="tg-user-menu__email">{user.email}</p>
                      </div>
                    </div>
                    <button className="tg-user-menu__item" onClick={() => switchPage(navigate, '/profile')} type="button">
                      Профиль
                    </button>
                    <button className="tg-user-menu__item" onClick={() => switchPage(navigate, '/my-ads')} type="button">
                      Мои объявления
                    </button>
                    {user.role === UserRole.CONTRACTOR && (
                      <button className="tg-user-menu__item" onClick={() => switchPage(navigate, '/create-ad')} type="button">
                        Создать объявление
                      </button>
                    )}
                    <button className="tg-user-menu__item tg-user-menu__item--danger" onClick={handleLogout} type="button">
                      Выйти
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <button className="tg-btn tg-btn--outline" onClick={() => switchPage(navigate, '/login')} type="button">
                Войти
              </button>
              <button className="tg-btn tg-btn--primary" onClick={() => switchPage(navigate, '/register')} type="button">
                Начать
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
