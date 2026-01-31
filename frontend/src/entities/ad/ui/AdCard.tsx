import React from 'react';
import { Card, Tag, Button, Space, Rate, Typography } from 'antd';
import {
  EnvironmentOutlined,
  DollarOutlined,
  UserOutlined,
  EyeOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { Ad, ProductType } from '@entities/ad/model/types';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

interface AdCardProps {
  ad: Ad;
  showContactButton?: boolean;
}

const productTypeLabels: Record<ProductType, string> = {
  [ProductType.GASOLINE_92]: 'АИ-92',
  [ProductType.GASOLINE_95]: 'АИ-95',
  [ProductType.GASOLINE_98]: 'АИ-98',
  [ProductType.DIESEL]: 'Дизель',
  [ProductType.FUEL_OIL]: 'Мазут',
  [ProductType.KEROSENE]: 'Керосин',
  [ProductType.GAS_OIL]: 'Газойль',
};

export const AdCard: React.FC<AdCardProps> = ({ ad, showContactButton = true }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/ads/${ad.id}`);
  };

  return (
    <Card
      hoverable
      onClick={handleViewDetails}
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e4eaec',
        cursor: 'pointer',
      }}
      bodyStyle={{ padding: '20px' }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* Header with product type and price */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Tag color="#0d94db" style={{ fontSize: '14px', padding: '4px 12px' }}>
              {productTypeLabels[ad.productType]}
            </Tag>
            <Text type="secondary" style={{ marginLeft: '8px' }}>
              {ad.quantity} тонн
            </Text>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Title level={4} style={{ margin: 0, color: '#0d94db' }}>
              {ad.price.toLocaleString('ru-RU')} ₽
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {ad.priceType === 'per_ton' ? 'за тонну' : 'всего'}
            </Text>
          </div>
        </div>

        {/* Route */}
        <div>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EnvironmentOutlined style={{ color: '#52c41a' }} />
              <Text strong>Погрузка:</Text>
              <Text>{ad.loadingAddress.city}, {ad.loadingAddress.address}</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EnvironmentOutlined style={{ color: '#ff4d4f' }} />
              <Text strong>Разгрузка:</Text>
              <Text>{ad.unloadingAddress.city}, {ad.unloadingAddress.address}</Text>
            </div>
          </Space>
        </div>

        {/* Additional info */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Tag>{ad.loadingMethod === 'top' ? 'Верхний налив' : 'Нижний налив'}</Tag>
          {ad.needsPump && <Tag color="orange">Требуется насос</Tag>}
        </div>

        {/* User info and stats */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '12px',
            borderTop: '1px solid #f0f0f0',
          }}
        >
          <Space>
            <UserOutlined style={{ color: '#8f9698' }} />
            <Text>{ad.user?.name || 'Заказчик'}</Text>
            {ad.user?.rating && (
              <Rate disabled defaultValue={ad.user.rating} style={{ fontSize: '14px' }} />
            )}
          </Space>
          <Space>
            <EyeOutlined style={{ color: '#8f9698' }} />
            <Text type="secondary">{ad.viewsCount || 0}</Text>
          </Space>
        </div>

        {/* Action button */}
        {showContactButton && (
          <Button
            type="primary"
            icon={<PhoneOutlined />}
            block
            size="large"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/ads/${ad.id}`);
            }}
          >
            Посмотреть контакты
          </Button>
        )}
      </Space>
    </Card>
  );
};
