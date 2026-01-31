import React, { useState } from "react";
import { Layout, List, Spin, Empty, Typography } from "antd";
import { useInfiniteQuery } from "@tanstack/react-query";
import { adsApi } from "@features/ads/api/adsApi";
import { AdFilters } from "@entities/ad/model/types";
import { AdCard } from "@entities/ad/ui/AdCard";
import { SearchFilters } from "@features/ads/ui/SearchFilters";
import InfiniteScroll from "react-infinite-scroll-component";
import { Chat } from "@widgets/Chat/Chat";

const { Content } = Layout;
const { Title } = Typography;

export const AdsListPage: React.FC = () => {
  const [filters, setFilters] = useState<AdFilters>({});

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["ads", filters],
      queryFn: ({ pageParam = 1 }) => adsApi.getAds(filters, pageParam, 20),
      getNextPageParam: (lastPage) => {
        const nextPage = lastPage.page + 1;
        return nextPage <= Math.ceil(lastPage.total / lastPage.limit)
          ? nextPage
          : undefined;
      },
      initialPageParam: 1,
    });

  const allAds = data?.pages.flatMap((page) => page.ads) || [];
  const totalCount = data?.pages[0]?.total || 0;

  const handleSearch = (newFilters: AdFilters) => {
    setFilters(newFilters);
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Content style={{ padding: "24px 50px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <Title level={2} style={{ marginBottom: "24px" }}>
            Поиск заказов
          </Title>

          <SearchFilters onSearch={handleSearch} loading={isLoading} />

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Spin size="large" />
            </div>
          ) : allAds.length === 0 ? (
            <Empty
              description="Объявления не найдены"
              style={{
                padding: "60px 0",
                background: "white",
                borderRadius: "12px",
              }}
            />
          ) : (
            <>
              <div style={{ marginBottom: "16px", color: "#8f9698" }}>
                Найдено объявлений: {totalCount}
              </div>

              <InfiniteScroll
                dataLength={allAds.length}
                next={fetchNextPage}
                hasMore={!!hasNextPage}
                loader={
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <Spin />
                  </div>
                }
                endMessage={
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#8f9698",
                    }}
                  >
                    Все объявления загружены
                  </div>
                }
              >
                <List
                  grid={{
                    gutter: 24,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 2,
                    xl: 3,
                    xxl: 3,
                  }}
                  dataSource={allAds}
                  renderItem={(ad) => (
                    <List.Item>
                      <AdCard ad={ad} />
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            </>
          )}
        </div>
      </Content>
      <Chat userId={localStorage.getItem("userId") || ""} chatId="1" />
    </Layout>
  );
};
