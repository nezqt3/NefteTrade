import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, MapPin, MessageCircle, Star } from "lucide-react";
import { message } from "antd";
import { Ad } from "@entities/ad/model/types";
import { productTypeLabels } from "@entities/ad/lib/productLabels";
import { paymentApi } from "@features/payment/api/paymentApi";
import {
  hasChatAccess,
  subscribeChatAccess,
  unlockChatAccess,
} from "@shared/lib/chatAccess";
import "./AdCard.css";

interface AdCardProps {
  ad: Ad;
  showContactButton?: boolean;
}

const CHAT_MAP_KEY = "tg-chat-map";

function getStoredChatMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(CHAT_MAP_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function getStoredChatId(adId: string): string | null {
  const map = getStoredChatMap();
  return map[adId] ?? null;
}

function storeChatId(adId: string, chatId: string): void {
  const map = getStoredChatMap();
  map[adId] = chatId;
  localStorage.setItem(CHAT_MAP_KEY, JSON.stringify(map));
}

export const AdCard: React.FC<AdCardProps> = ({
  ad,
  showContactButton = true,
}) => {
  const navigate = useNavigate();
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [chatId, setChatId] = useState<string | null>(() =>
    getStoredChatId(ad.id),
  );
  const [chatAccess, setChatAccess] = useState(() => hasChatAccess());

  useEffect(() => {
    const unsubscribe = subscribeChatAccess(() => {
      setChatAccess(hasChatAccess());
    });
    return unsubscribe;
  }, []);

  const handleCardClick = () => {
    navigate(`/ads/${ad.id}`);
  };

  const openChat = () => {
    if (!chatAccess) {
      setIsPaywallOpen(true);
      return;
    }

    if (chatId) {
      navigate(`/messages/${chatId}`);
      return;
    }

    navigate("/messages");
  };

  const unlockChat = async () => {
    try {
      setIsPaying(true);
      const result = await paymentApi.unlockContact(ad.id);
      const unlockedChatId = result.chatId ? String(result.chatId) : ad.id;
      setChatId(unlockedChatId);
      storeChatId(ad.id, unlockedChatId);
      unlockChatAccess();
      setChatAccess(true);
      setIsPaywallOpen(false);
      message.success("Доступ к чату активирован");
    } catch {
      message.error("Не удалось провести оплату. Попробуйте снова.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <>
      <article
        className="tg-ad-card ad-card"
        onClick={handleCardClick}
        aria-label="Карточка объявления"
      >
        <div className="tg-ad-card__top-line" aria-hidden="true" />

        <header className="tg-ad-card__header">
          <div>
            <span className="tg-ad-card__badge">
              {productTypeLabels[ad.productType]}
            </span>
            <p className="tg-ad-card__quantity">{ad.quantity} тонн</p>
          </div>
          <div className="tg-ad-card__price-wrap">
            <p className="tg-ad-card__price tg-number">
              {ad.price.toLocaleString("ru-RU")}₽
            </p>
            <p className="tg-ad-card__price-note">
              {ad.priceType === "per_ton" ? "за тонну" : "за всё"}
            </p>
          </div>
        </header>

        <section className="tg-ad-card__route">
          <div className="tg-ad-card__route-item">
            <span
              className="tg-ad-card__route-icon tg-ad-card__route-icon--from route-icon"
              aria-hidden="true"
            >
              <MapPin size={16} strokeWidth={2.3} />
            </span>
            <div>
              <p className="tg-ad-card__route-title">Погрузка</p>
              <p>
                {ad.loadingAddress.city}, {ad.loadingAddress.address}
              </p>
            </div>
          </div>
          <div className="tg-ad-card__route-item">
            <span
              className="tg-ad-card__route-icon tg-ad-card__route-icon--to route-icon"
              aria-hidden="true"
            >
              <MapPin size={16} strokeWidth={2.3} />
            </span>
            <div>
              <p className="tg-ad-card__route-title">Разгрузка</p>
              <p>
                {ad.unloadingAddress.city}, {ad.unloadingAddress.address}
              </p>
            </div>
          </div>
        </section>

        <div className="tg-ad-card__tags">
          <span className="tg-ad-card__tag">
            {ad.loadingMethod === "top" ? "Верхний налив" : "Нижний налив"}
          </span>
          {ad.needsPump && (
            <span className="tg-ad-card__tag tg-ad-card__tag--warning">
              Треб. насос
            </span>
          )}
        </div>

        <footer className="tg-ad-card__footer">
          <span className="tg-ad-card__avatar user-avatar" aria-hidden="true">
            {(ad.user?.name || "З").charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="tg-ad-card__user-name">
              {ad.user?.name || "Заказчик"}
            </p>
            <p className="tg-ad-card__rating">
              <Star size={12} strokeWidth={2.1} />
              {ad.user?.rating?.toFixed(1) || "4.8"}
            </p>
          </div>
        </footer>

        {showContactButton && (
          <div className="tg-ad-card__actions">
            <button
              className="tg-btn tg-btn--primary tg-btn--block"
              onClick={(event) => {
                event.stopPropagation();
                navigate(`/ads/${ad.id}`);
              }}
              type="button"
            >
              Посмотреть контакты
            </button>
            <button
              className={`tg-btn tg-btn--block ${chatAccess ? "tg-btn--success" : "tg-btn--accent"}`}
              onClick={(event) => {
                event.stopPropagation();
                openChat();
              }}
              type="button"
            >
              <MessageCircle size={17} strokeWidth={2.2} />
              {chatAccess ? "Открыть чат" : "Написать заказчику"}
            </button>
          </div>
        )}
      </article>

      {isPaywallOpen && (
        <div
          className="tg-paywall"
          role="dialog"
          aria-modal="true"
          aria-label="Оплата доступа к чату"
        >
          <button
            className="tg-paywall__overlay"
            type="button"
            onClick={() => setIsPaywallOpen(false)}
            aria-label="Закрыть окно"
          />
          <div className="tg-paywall__modal">
            <div className="tg-paywall__stripe" aria-hidden="true" />
            <h3 className="tg-paywall__title tg-gradient-text">
              Доступ к чату
            </h3>
            <p className="tg-paywall__description">
              Чтобы связаться с заказчиком, необходимо активировать доступ к
              чату.
            </p>
            <p className="tg-paywall__price">500₽</p>
            <p className="tg-paywall__caption">Единоразовая оплата</p>

            <ul className="tg-paywall__benefits">
              <li>
                <CheckCircle2 size={16} strokeWidth={2.4} />
                Прямой контакт с заказчиком
              </li>
              <li>
                <CheckCircle2 size={16} strokeWidth={2.4} />
                Мгновенные уведомления
              </li>
              <li>
                <CheckCircle2 size={16} strokeWidth={2.4} />
                Закрытая переписка
              </li>
              <li>
                <CheckCircle2 size={16} strokeWidth={2.4} />
                Без посредников
              </li>
            </ul>

            <div className="tg-paywall__actions">
              <button
                className="tg-btn tg-btn--accent"
                onClick={unlockChat}
                disabled={isPaying}
                type="button"
              >
                {isPaying ? "Оплата..." : "Оплатить"}
              </button>
              <button
                className="tg-btn tg-btn--outline"
                onClick={() => setIsPaywallOpen(false)}
                type="button"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
