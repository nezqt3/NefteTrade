import React from 'react';
import { Link } from 'react-router-dom';
import { Clock3, Mail, MapPin, MessageCircle, Phone, Send, Youtube } from 'lucide-react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="tg-site-footer" aria-label="Подвал сайта">
      <div className="tg-container tg-site-footer__content">
        <div className="tg-site-footer__brand">
          <Link to="/" className="tg-site-footer__logo" aria-label="ТрансГарант - на главную">
            ТрансГарант
          </Link>
          <p className="tg-site-footer__text">
            Премиальная платформа для перевозки нефтепродуктов: объявления, безопасные сделки, прямой чат и контроль логистики.
          </p>
          <ul className="tg-site-footer__contacts">
            <li>
              <MapPin size={16} strokeWidth={2.3} />
              Москва, ул. Промышленная, 15
            </li>
            <li>
              <Phone size={16} strokeWidth={2.3} />
              <a href="tel:+74957774500">+7 (495) 777-45-00</a>
            </li>
            <li>
              <Mail size={16} strokeWidth={2.3} />
              <a href="mailto:support@transgarant.ru">support@transgarant.ru</a>
            </li>
            <li>
              <Clock3 size={16} strokeWidth={2.3} />
              Пн-Пт 09:00-20:00, Сб 10:00-16:00
            </li>
          </ul>
        </div>

        <nav className="tg-site-footer__column" aria-label="Навигация платформы">
          <h4>Платформа</h4>
          <Link to="/">Главная</Link>
          <Link to="/ads">Объявления</Link>
          <Link to="/create-ad">Создать объявление</Link>
          <Link to="/messages">Сообщения</Link>
        </nav>

        <nav className="tg-site-footer__column" aria-label="О компании">
          <h4>Компания</h4>
          <Link to="/about">О нас</Link>
          <a href="#">Партнёрская программа</a>
          <a href="#">Карьера</a>
          <a href="#">Новости</a>
        </nav>

        <nav className="tg-site-footer__column" aria-label="Юридическая информация">
          <h4>Документы</h4>
          <a href="#">Пользовательское соглашение</a>
          <a href="#">Политика конфиденциальности</a>
          <a href="#">Публичная оферта</a>
          <a href="#">Комплаенс и безопасность</a>
        </nav>
      </div>

      <div className="tg-site-footer__bottom">
        <div className="tg-container tg-site-footer__bottom-content">
          <p>ТрансГарант ©{new Date().getFullYear()}. Все права защищены.</p>
          <div className="tg-site-footer__socials" aria-label="Социальные сети">
            <a href="#" aria-label="Telegram">
              <Send size={16} strokeWidth={2.3} />
            </a>
            <a href="#" aria-label="VK">
              <MessageCircle size={16} strokeWidth={2.3} />
            </a>
            <a href="#" aria-label="YouTube">
              <Youtube size={16} strokeWidth={2.3} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
