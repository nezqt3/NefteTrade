import React from "react";
import { Layout, List, Spin, Empty, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { adsApi } from "@features/ads/api/adsApi";
import { AdCard } from "@entities/ad/ui/AdCard";

const { Content } = Layout;
const { Title } = Typography;

export const MyAdsPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["my-ads"],
    queryFn: () => adsApi.getMyAds(),
  });

  const ads = data || [];

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Content style={{ padding: "24px 50px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <Title level={2} style={{ marginBottom: "24px" }}>
            Мои объявления
          </Title>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Spin size="large" />
            </div>
          ) : ads.length === 0 ? (
            <Empty
              description="У вас пока нет объявлений"
              style={{
                padding: "60px 0",
                background: "white",
                borderRadius: "12px",
              }}
            />
          ) : (
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
              dataSource={ads}
              renderItem={(ad) => (
                <List.Item>
                  <AdCard ad={ad} showContactButton={false} />
                </List.Item>
              )}
            />
          )}
        </div>
      </Content>
    </Layout>
  );
};
