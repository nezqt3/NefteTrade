import React from 'react';
import {
  Building2,
  CalendarClock,
  Fuel,
  Gauge,
  Globe2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Telescope,
} from 'lucide-react';
import './AboutPage.css';

const values = [
  {
    icon: ShieldCheck,
    title: 'Ответственность',
    text: 'Контролируем каждую перевозку от заявки до разгрузки, соблюдая отраслевые требования и сроки.',
  },
  {
    icon: Gauge,
    title: 'Оперативность',
    text: 'Быстро соединяем заказчиков и подрядчиков, чтобы минимизировать простой техники и потери времени.',
  },
  {
    icon: Telescope,
    title: 'Прозрачность',
    text: 'Все условия, маршруты и статусы видны участникам сделки в едином интерфейсе без посредников.',
  },
];

const milestones = [
  {
    icon: CalendarClock,
    year: '2019',
    title: 'Запуск платформы',
    text: 'Команда ТрансГарант запустила B2B-сервис для рынка перевозки нефтепродуктов.',
  },
  {
    icon: Fuel,
    year: '2021',
    title: 'Масштабирование',
    text: 'Подключили ключевые нефтебазы и перевозчиков, внедрили ускоренную модерацию заявок.',
  },
  {
    icon: Globe2,
    year: '2024',
    title: 'Единый цифровой контур',
    text: 'Объединили поиск, сделки и чат в единую экосистему с контролем SLA и прозрачной аналитикой.',
  },
];

const historyStats = [
  { value: '7+', label: 'Лет в логистике' },
  { value: '40+', label: 'Регионов покрытия' },
  { value: '98%', label: 'Успешных сделок' },
];

const team = [
  { name: 'Анна Морозова', role: 'CEO', initials: 'АМ' },
  { name: 'Роман Кузнецов', role: 'Операционный директор', initials: 'РК' },
  { name: 'Ирина Волкова', role: 'Руководитель логистики', initials: 'ИВ' },
  { name: 'Дмитрий Смирнов', role: 'Технический директор', initials: 'ДС' },
];

const contacts = [
  {
    icon: MapPin,
    title: 'Адрес',
    text: 'г. Москва, ул. Промышленная, 15, офис 402',
  },
  {
    icon: Phone,
    title: 'Телефон',
    text: '+7 (495) 777-45-00',
  },
  {
    icon: Mail,
    title: 'Email',
    text: 'support@transgarant.ru',
  },
  {
    icon: Building2,
    title: 'Режим работы',
    text: 'Пн-Пт 09:00-20:00, Сб 10:00-16:00',
  },
];

export const AboutPage: React.FC = () => {
  return (
    <main className="tg-about tg-page-animate">
      <section className="tg-about__hero">
        <div className="tg-about__hero-grid" aria-hidden="true" />
        <div className="tg-about__hero-glow" aria-hidden="true" />

        <div className="tg-container tg-about__hero-content">
          <p className="tg-about__hero-kicker">О компании</p>
          <h1 className="tg-about__title">О компании ТрансГарант</h1>
          <p className="tg-about__subtitle">
            Создаем премиальную экосистему для перевозки нефтепродуктов, где каждая сделка контролируема, прозрачна и безопасна.
          </p>
          <div className="tg-about__hero-tags">
            <span>B2B платформа</span>
            <span>Проверенные партнеры</span>
            <span>Контроль перевозок 24/7</span>
          </div>
        </div>
      </section>

      <section className="tg-about__section tg-about__section--history">
        <div className="tg-container">
          <div className="tg-about__history-shell">
            <article className="tg-about__history-intro">
              <h2 className="tg-gradient-text">История компании</h2>
              <p>
                ТрансГарант начался как нишевый продукт для профессиональных перевозчиков нефтепродуктов, которым нужен высокий темп
                согласований и строгий контроль качества маршрута.
              </p>
              <p>
                Сегодня это масштабная технологическая платформа, объединяющая заказчиков и подрядчиков в едином интерфейсе с
                прозрачными условиями, безопасной коммуникацией и контролем исполнения.
              </p>

              <div className="tg-about__history-stats">
                {historyStats.map((item) => (
                  <div key={item.label} className="tg-about__history-stat">
                    <strong className="tg-number">{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </article>

            <div className="tg-about__timeline">
              {milestones.map((milestone) => (
                <article key={milestone.year} className="tg-about__timeline-item">
                  <div className="tg-about__timeline-icon" aria-hidden="true">
                    <milestone.icon size={20} strokeWidth={2.3} />
                  </div>
                  <div>
                    <p className="tg-about__timeline-year">{milestone.year}</p>
                    <h3>{milestone.title}</h3>
                    <p>{milestone.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="tg-about__section">
        <div className="tg-container">
          <h2 className="tg-gradient-text tg-about__section-title">Наши ценности</h2>
          <div className="tg-about__values">
            {values.map((value) => (
              <article key={value.title} className="tg-about__value-card">
                <div className="tg-about__value-icon" aria-hidden="true">
                  <value.icon size={34} strokeWidth={2.2} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="tg-about__section">
        <div className="tg-container">
          <h2 className="tg-gradient-text tg-about__section-title">Команда</h2>
          <div className="tg-about__team">
            {team.map((member) => (
              <article key={member.name} className="tg-about__member">
                <div className="tg-about__avatar" aria-label={`Аватар ${member.name}`}>
                  {member.initials}
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="tg-about__section tg-about__section--contacts">
        <div className="tg-container">
          <h2 className="tg-gradient-text tg-about__section-title">Контакты</h2>
          <div className="tg-about__contacts">
            {contacts.map((contact) => (
              <article key={contact.title} className="tg-about__contact-item">
                <div className="tg-about__contact-icon" aria-hidden="true">
                  <contact.icon size={19} strokeWidth={2.3} />
                </div>
                <div>
                  <h3>{contact.title}</h3>
                  <p>{contact.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
