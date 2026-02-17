import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, MapPin, MessageSquare, Phone, Star, UserRound } from 'lucide-react';
import {
  Layout,
  Card,
  Typography,
  Space,
  Tag,
  Button,
  Descriptions,
  Modal,
  message,
  Spin,
} from 'antd';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adsApi } from '@features/ads/api/adsApi';
import { paymentApi } from '@features/payment/api/paymentApi';
import { ProductType } from '@entities/ad/model/types';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const productTypeLabels: Record<ProductType, string> = {
  [ProductType.GASOLINE_92]: 'АИ-92',
  [ProductType.GASOLINE_95]: 'АИ-95',
  [ProductType.GASOLINE_98]: 'АИ-98',
  [ProductType.DIESEL]: 'Дизель',
  [ProductType.FUEL_OIL]: 'Мазут',
  [ProductType.KEROSENE]: 'Керосин',
  [ProductType.GAS_OIL]: 'Газойль',
};

export const AdDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contactUnlocked, setContactUnlocked] = useState(false);
  const [unlockedPhone, setUnlockedPhone] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);

  const { data: ad, isLoading } = useQuery({
    queryKey: ['ad', id],
    queryFn: () => adsApi.getAdById(id!),
    enabled: !!id,
  });

  const unlockMutation = useMutation({
    mutationFn: () => paymentApi.unlockContact(id!),
    onSuccess: (data) => {
      setContactUnlocked(true);
      setUnlockedPhone(data.phone);
      if (data.chatId) {
        setChatId(String(data.chatId));
      }
      message.success('Контакт успешно открыт!');
    },
    onError: () => {
      message.error('Ошибка при открытии контакта');
    },
  });

  const handleUnlockContact = () => {
    Modal.confirm({
      title: 'Открыть контакты?',
      content: (
        <div>
          <Paragraph>
            Стоимость доступа к контактам: <strong>500 ₽</strong>
          </Paragraph>
          <Paragraph>
            После оплаты вы получите доступ к номеру телефона заказчика и сможете открыть чат.
          </Paragraph>
        </div>
      ),
      okText: 'Оплатить',
      cancelText: 'Отмена',
      onOk: () => {
        unlockMutation.mutate();
      },
    });
  };

  if (isLoading || !ad) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content style={{ padding: '24px 50px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Button
            onClick={() => navigate(-1)}
            style={{ marginBottom: '24px' }}
            icon={<ArrowLeft size={16} strokeWidth={2.3} />}
          >
            Назад
          </Button>

          <Card
            style={{
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <Space size="large" style={{ width: '100%', justifyContent: 'space-between' }}>
                <Space>
                  <Tag color="#0d94db" style={{ fontSize: '16px', padding: '6px 16px' }}>
                    {productTypeLabels[ad.productType]}
                  </Tag>
                  <Text style={{ fontSize: '16px' }}>{ad.quantity} тонн</Text>
                </Space>
                <Title level={2} style={{ margin: 0, color: '#0d94db' }}>
                  {ad.price.toLocaleString('ru-RU')} ₽
                  <Text type="secondary" style={{ fontSize: '14px', marginLeft: '8px' }}>
                    {ad.priceType === 'per_ton' ? '/ тонна' : 'всего'}
                  </Text>
                </Title>
              </Space>
            </div>

            {/* Route */}
            <Card
              style={{
                background: '#f9fafb',
                marginBottom: '32px',
                border: '1px solid #e4eaec',
              }}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <MapPin size={20} strokeWidth={2.3} style={{ color: '#52c41a' }} />
                    <Title level={5} style={{ margin: 0 }}>Погрузка</Title>
                  </div>
                  <Text style={{ fontSize: '16px', marginLeft: '32px' }}>
                    {ad.loadingAddress.city}, {ad.loadingAddress.address}
                  </Text>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <MapPin size={20} strokeWidth={2.3} style={{ color: '#ff4d4f' }} />
                    <Title level={5} style={{ margin: 0 }}>Разгрузка</Title>
                  </div>
                  <Text style={{ fontSize: '16px', marginLeft: '32px' }}>
                    {ad.unloadingAddress.city}, {ad.unloadingAddress.address}
                  </Text>
                </div>
              </Space>
            </Card>

            {/* Details */}
            <Descriptions
              title="Детали заказа"
              bordered
              column={2}
              style={{ marginBottom: '32px' }}
            >
              <Descriptions.Item label="Способ налива">
                {ad.loadingMethod === 'top' ? 'Верхний' : 'Нижний'}
              </Descriptions.Item>
              <Descriptions.Item label="Наличие насоса">
                {ad.needsPump ? 'Требуется' : 'Не требуется'}
              </Descriptions.Item>
              <Descriptions.Item label="Дата создания" span={2}>
                {new Date(ad.createdAt).toLocaleDateString('ru-RU')}
              </Descriptions.Item>
              {ad.description && (
                <Descriptions.Item label="Описание" span={2}>
                  {ad.description}
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* Customer info */}
            <Card
              title={
                <Space>
                  <UserRound size={18} strokeWidth={2.3} />
                  <span>Информация о заказчике</span>
                </Space>
              }
              style={{ marginBottom: '24px' }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Text strong style={{ fontSize: '16px' }}>
                      {ad.user?.name || 'Заказчик'}
                    </Text>
                    {ad.user?.rating && (
                      <Space size={4}>
                        <Star size={14} strokeWidth={2.3} style={{ color: '#f5a524' }} />
                        <Text style={{ color: '#718096' }}>{ad.user.rating.toFixed(1)}</Text>
                      </Space>
                    )}
                  </Space>
                </div>

                {contactUnlocked && unlockedPhone ? (
                  <div>
                    <Space>
                      <Phone size={16} strokeWidth={2.3} style={{ color: '#0d94db' }} />
                      <Text strong style={{ fontSize: '16px' }}>
                        {unlockedPhone}
                      </Text>
                    </Space>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px', background: '#f9fafb', borderRadius: '8px' }}>
                    <Lock size={48} strokeWidth={2.2} style={{ color: '#acacb4', marginBottom: '16px' }} />
                    <Paragraph type="secondary">
                      Номер телефона скрыт. Для доступа к контактам необходимо оплатить 500 ₽
                    </Paragraph>
                    <Button
                      type="primary"
                      size="large"
                      icon={<Phone size={16} strokeWidth={2.3} />}
                      onClick={handleUnlockContact}
                      loading={unlockMutation.isPending}
                    >
                      Открыть контакты за 500 ₽
                    </Button>
                  </div>
                )}
              </Space>
            </Card>

            {/* Chat button (only if contact unlocked) */}
            {contactUnlocked && (
              <Button
                type="primary"
                size="large"
                icon={<MessageSquare size={16} strokeWidth={2.3} />}
                block
                onClick={() => navigate(`/messages/${chatId || id}`)}
              >
                Открыть чат
              </Button>
            )}
          </Card>
        </div>
      </Content>
    </Layout>
  );
};
