import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ShieldCheck, Zap } from 'lucide-react';
import { useAuthStore } from '@app/store/authStore';
import { UserRole } from '@entities/user/model/types';
import { switchPage } from '@shared/lib/switchPage';
import './HomePage.css';

const stats = [
  { label: 'Активных заказов', value: '2,500+' },
  { label: 'Партнёров', value: '1,200+' },
  { label: 'Успех', value: '98%' },
  { label: 'Поддержка', value: '24/7' },
];

const features = [
  {
    icon: ShieldCheck,
    title: 'Безопасность',
    text: 'Проверяем участников, контролируем документы и поддерживаем безопасность сделки от старта до закрытия.',
  },
  {
    icon: Zap,
    title: 'Скорость',
    text: 'Интеллектуальные фильтры и быстрое согласование позволяют находить подходящие маршруты за минуты.',
  },
  {
    icon: BarChart3,
    title: 'Прозрачность',
    text: 'Каждый этап маршрута, условия оплаты и коммуникация фиксируются в едином цифровом контуре.',
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <main className="tg-home tg-page-animate">
      <section className="tg-home__hero">
        <div className="tg-home__grid-overlay" aria-hidden="true" />
        <div className="tg-home__hero-glow" aria-hidden="true" />

        <div className="tg-container tg-home__hero-content">
          <h1 className="tg-home__hero-title">Перевозки нового уровня</h1>
          <p className="tg-home__hero-subtitle">
            Премиальная цифровая платформа для нефтепродуктов: объявления, верифицированные партнеры, быстрый поиск и прямой чат.
          </p>
          <div className="tg-home__hero-actions">
            <button className="tg-btn tg-btn--outline tg-home__hero-main-btn" onClick={() => switchPage(navigate, '/ads')} type="button">
              Найти перевозку
            </button>
            {isAuthenticated && user?.role === UserRole.CONTRACTOR ? (
              <button className="tg-btn tg-btn--glass" onClick={() => switchPage(navigate, '/create-ad')} type="button">
                Создать объявление
              </button>
            ) : (
              <button className="tg-btn tg-btn--glass" onClick={() => switchPage(navigate, '/register')} type="button">
                Стать партнёром
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="tg-home__stats-wrap">
        <div className="tg-container">
          <div className="tg-home__stats">
            {stats.map((stat) => (
              <article key={stat.label} className="tg-home__stat-card">
                <p className="tg-home__stat-value tg-number">{stat.value}</p>
                <p className="tg-home__stat-label">{stat.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="tg-home__features tg-page">
        <div className="tg-container">
          <h2 className="tg-home__section-title tg-gradient-text">Почему выбирают нас</h2>
          <div className="tg-home__features-grid">
            {features.map((feature) => (
              <article key={feature.title} className="tg-home__feature-card">
                <div className="tg-home__feature-icon feature-icon" aria-hidden="true">
                  <feature.icon size={38} strokeWidth={2.2} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="tg-home__cta">
        <div className="tg-container tg-home__cta-content">
          <h2>Готовы вывести логистику на новый уровень?</h2>
          <p>Присоединяйтесь к ТрансГарант и работайте напрямую с проверенными участниками рынка.</p>
          <div className="tg-home__cta-actions">
            <button className="tg-btn tg-btn--primary" onClick={() => switchPage(navigate, '/ads')} type="button">
              Смотреть объявления
            </button>
            {!isAuthenticated && (
              <button className="tg-btn tg-btn--outline" onClick={() => switchPage(navigate, '/register')} type="button">
                Начать сейчас
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};
