import React, { useState } from 'react';
import { message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ClipboardList, Truck } from 'lucide-react';
import { authApi } from '@features/auth/api/authApi';
import { useAuthStore } from '@app/store/authStore';
import { UserRole } from '@entities/user/model/types';
import '../AuthPages.css';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const registerMutation = useMutation({
    mutationFn: () => authApi.register({ email, password, name, phone, role }),
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      localStorage.setItem('userId', data.user.id);
      setUser(data.user);
      message.success('Регистрация успешна');
      navigate('/');
    },
    onError: () => {
      message.error('Ошибка регистрации');
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !email || !phone || !password || !confirmPassword) {
      message.error('Заполните все поля');
      return;
    }

    if (password.length < 8) {
      message.error('Пароль должен содержать минимум 8 символов');
      return;
    }

    if (password !== confirmPassword) {
      message.error('Пароли не совпадают');
      return;
    }

    registerMutation.mutate();
  };

  return (
    <main className="tg-auth tg-page-animate">
      <section className="tg-auth__card">
        <div className="tg-auth__stripe" aria-hidden="true" />
        <div className="tg-auth__inner">
          <h1 className="tg-auth__logo tg-gradient-text">ТрансГарант</h1>
          <p className="tg-auth__subtitle">Создайте новый аккаунт</p>

          <form className="tg-auth__form" onSubmit={handleSubmit}>
            <div className="tg-role-selector" role="group" aria-label="Выбор роли">
              <button
                className={`tg-role-selector__btn ${role === UserRole.CUSTOMER ? 'tg-role-selector__btn--active' : ''}`}
                type="button"
                onClick={() => setRole(UserRole.CUSTOMER)}
              >
                <ClipboardList className="tg-role-selector__emoji" size={30} strokeWidth={2.2} aria-hidden="true" />
                Заказчик
              </button>
              <button
                className={`tg-role-selector__btn ${role === UserRole.CONTRACTOR ? 'tg-role-selector__btn--active' : ''}`}
                type="button"
                onClick={() => setRole(UserRole.CONTRACTOR)}
              >
                <Truck className="tg-role-selector__emoji" size={30} strokeWidth={2.2} aria-hidden="true" />
                Подрядчик
              </button>
            </div>

            <label className="tg-field">
              <span className="tg-field__label">Имя</span>
              <input className="tg-input" placeholder="Имя" value={name} onChange={(event) => setName(event.target.value)} />
            </label>

            <label className="tg-field">
              <span className="tg-field__label">Email</span>
              <input
                className="tg-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="tg-field">
              <span className="tg-field__label">Телефон</span>
              <input className="tg-input" placeholder="Телефон" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </label>

            <label className="tg-field">
              <span className="tg-field__label">Пароль</span>
              <input
                className="tg-input"
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            <label className="tg-field">
              <span className="tg-field__label">Подтвердите пароль</span>
              <input
                className="tg-input"
                type="password"
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </label>

            <button className="tg-btn tg-btn--primary tg-btn--block" type="submit" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>

            <p className="tg-auth__footer">
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};
