import React, { useState } from 'react';
import { Empty, Spin } from 'antd';
import { useInfiniteQuery } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import { adsApi } from '@features/ads/api/adsApi';
import { Ad, AdFilters, LoadingMethod, ProductType } from '@entities/ad/model/types';
import { AdCard } from '@entities/ad/ui/AdCard';
import { SearchFilters } from '@features/ads/ui/SearchFilters';
import './AdsListPage.css';

const sampleAds: Ad[] = [
  {
    id: 'sample-1',
    userId: '1',
    user: { name: 'ООО \"ТрансКом\"', rating: 4.9 },
    loadingAddress: { city: 'Москва', address: 'ул. Промышленная, 5' },
    unloadingAddress: { city: 'Казань', address: 'ул. Складская, 12' },
    productType: ProductType.GASOLINE_95,
    quantity: 25,
    loadingMethod: LoadingMethod.TOP,
    needsPump: true,
    price: 45000,
    priceType: 'per_ton',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewsCount: 0,
    contactViewsCount: 0,
  },
  {
    id: 'sample-2',
    userId: '2',
    user: { name: 'Петров Иван', rating: 4.5 },
    loadingAddress: { city: 'Санкт-Петербург', address: 'ул. Северная, 9' },
    unloadingAddress: { city: 'Великий Новгород', address: 'Складской проезд, 4' },
    productType: ProductType.DIESEL,
    quantity: 40,
    loadingMethod: LoadingMethod.BOTTOM,
    needsPump: false,
    price: 1800000,
    priceType: 'total',
    description: 'Срочно',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewsCount: 0,
    contactViewsCount: 0,
  },
  {
    id: 'sample-3',
    userId: '3',
    user: { name: 'ИП Сидоров', rating: 5 },
    loadingAddress: { city: 'Тюмень', address: 'Промзона, 2' },
    unloadingAddress: { city: 'Екатеринбург', address: 'ул. Заводская, 18' },
    productType: ProductType.FUEL_OIL,
    quantity: 60,
    loadingMethod: LoadingMethod.TOP,
    needsPump: false,
    price: 32500,
    priceType: 'per_ton',
    description: 'VIP',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewsCount: 0,
    contactViewsCount: 0,
  },
];

export const AdsListPage: React.FC = () => {
  const [filters, setFilters] = useState<AdFilters>({});

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['ads', filters],
    queryFn: ({ pageParam = 1 }) => adsApi.getAds(filters, pageParam, 20),
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      return nextPage <= Math.ceil(lastPage.total / lastPage.limit) ? nextPage : undefined;
    },
    initialPageParam: 1,
  });

  const allAds = data?.pages.flatMap((page) => page.ads) || [];
  const hasFilters = Object.keys(filters).length > 0;
  const displayedAds = allAds.length > 0 ? allAds : hasFilters ? [] : sampleAds;
  const totalCount = allAds.length > 0 ? data?.pages[0]?.total || allAds.length : displayedAds.length;

  return (
    <main className="tg-ads tg-page tg-page-animate">
      <div className="tg-container">
        <header className="tg-ads__header">
          <h1>Объявления</h1>
          <p>Актуальные заказы на перевозку нефтепродуктов с удобной фильтрацией и быстрым доступом к контактам.</p>
        </header>

        <SearchFilters onSearch={setFilters} loading={isLoading} />

        {isLoading ? (
          <div className="tg-ads__loading">
            <Spin size="large" />
          </div>
        ) : displayedAds.length === 0 ? (
          <Empty className="tg-ads__empty" description="Объявления не найдены" />
        ) : (
          <>
            <p className="tg-ads__count">Найдено объявлений: {totalCount}</p>

            <InfiniteScroll
              dataLength={displayedAds.length}
              next={fetchNextPage}
              hasMore={Boolean(hasNextPage)}
              loader={
                <div className="tg-ads__loader">
                  <Spin />
                </div>
              }
              endMessage={<p className="tg-ads__end">Все объявления загружены</p>}
            >
              <div className="tg-ads__grid">
                {displayedAds.map((ad) => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
            </InfiniteScroll>
          </>
        )}
      </div>
    </main>
  );
};
