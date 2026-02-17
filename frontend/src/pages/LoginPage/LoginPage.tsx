import React, { useState } from 'react';
import { message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@features/auth/api/authApi';
import { useAuthStore } from '@app/store/authStore';
import '../AuthPages.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation({
    mutationFn: () => authApi.login({ email, password }),
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      localStorage.setItem('userId', data.user.id);
      setUser(data.user);
      message.success('Вход выполнен успешно');
      navigate('/');
    },
    onError: () => {
      message.error('Неверный email или пароль');
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      message.error('Заполните email и пароль');
      return;
    }
    loginMutation.mutate();
  };

  return (
    <main className="tg-auth tg-page-animate">
      <section className="tg-auth__card">
        <div className="tg-auth__stripe" aria-hidden="true" />
        <div className="tg-auth__inner">
          <h1 className="tg-auth__logo tg-gradient-text">ТрансГарант</h1>
          <p className="tg-auth__subtitle">Войдите в свой аккаунт</p>

          <form className="tg-auth__form" onSubmit={handleSubmit}>
            <label className="tg-field">
              <span className="tg-field__label">Email</span>
              <input
                className="tg-input"
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="tg-field">
              <span className="tg-field__label">Пароль</span>
              <input
                className="tg-input"
                type="password"
                placeholder="Пароль"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            <button className="tg-btn tg-btn--primary tg-btn--block" type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Вход...' : 'Войти'}
            </button>

            <p className="tg-auth__footer">
              Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};
