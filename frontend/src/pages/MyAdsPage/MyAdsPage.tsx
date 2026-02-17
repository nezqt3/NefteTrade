import React from 'react';
import { Empty, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { adsApi } from '@features/ads/api/adsApi';
import { AdCard } from '@entities/ad/ui/AdCard';
import './MyAdsPage.css';

export const MyAdsPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['my-ads'],
    queryFn: () => adsApi.getMyAds(),
  });

  const ads = data || [];

  return (
    <main className="tg-my-ads tg-page tg-page-animate">
      <div className="tg-container">
        <header className="tg-my-ads__header">
          <h1>Мои объявления</h1>
          <p>Управляйте своими активными заказами в едином интерфейсе.</p>
        </header>

        {isLoading ? (
          <div className="tg-my-ads__loading">
            <Spin size="large" />
          </div>
        ) : ads.length === 0 ? (
          <Empty className="tg-my-ads__empty" description="У вас пока нет объявлений" />
        ) : (
          <div className="tg-my-ads__grid">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} showContactButton={false} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
