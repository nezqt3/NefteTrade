import React from 'react';
import { Button, Typography, Space, Row, Col } from 'antd';
import { PlusOutlined, SearchOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@app/store/authStore';
import { UserRole } from '@entities/user/model/types';

const { Title, Paragraph } = Typography;

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div>
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0d94db 0%, #4cabda 100%)',
          padding: '80px 50px',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Title level={1} style={{ color: 'white', fontSize: '48px', marginBottom: '24px' }}>
          Платформа для перевозки нефтепродуктов
        </Title>
        <Paragraph style={{ fontSize: '20px', color: 'rgba(255,255,255,0.9)', maxWidth: '800px', margin: '0 auto 40px' }}>
          Быстрый поиск заказов и исполнителей. Безопасные сделки с проверенными подрядчиками.
        </Paragraph>

        <Space size="large">
          {isAuthenticated && user?.role === UserRole.CONTRACTOR ? (
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate('/create-ad')}
              style={{
                height: '56px',
                fontSize: '18px',
                padding: '0 40px',
                background: 'white',
                color: '#0d94db',
                border: 'none',
              }}
            >
              Создать объявление
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={() => navigate('/ads')}
              style={{
                height: '56px',
                fontSize: '18px',
                padding: '0 40px',
                background: 'white',
                color: '#0d94db',
                border: 'none',
              }}
            >
              Найти перевозку
            </Button>
          )}

          {!isAuthenticated && (
            <Button
              size="large"
              onClick={() => navigate('/register')}
              style={{
                height: '56px',
                fontSize: '18px',
                padding: '0 40px',
                background: 'transparent',
                color: 'white',
                border: '2px solid white',
              }}
            >
              Зарегистрироваться
            </Button>
          )}
        </Space>
      </div>

      {/* Features Section */}
      <div style={{ padding: '80px 50px', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '60px', color: '#4c545c' }}>
          Почему выбирают нас
        </Title>

        <Row gutter={[48, 48]}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#e4eaec',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <SafetyOutlined style={{ fontSize: '40px', color: '#0d94db' }} />
              </div>
              <Title level={4} style={{ marginBottom: '16px' }}>
                Проверенные подрядчики
              </Title>
              <Paragraph style={{ fontSize: '16px', color: '#5e6669' }}>
                Все подрядчики проходят обязательную верификацию документов перед началом работы
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#e4eaec',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <SearchOutlined style={{ fontSize: '40px', color: '#0d94db' }} />
              </div>
              <Title level={4} style={{ marginBottom: '16px' }}>
                Удобный поиск
              </Title>
              <Paragraph style={{ fontSize: '16px', color: '#5e6669' }}>
                Мощные фильтры для быстрого поиска подходящих заказов по маршруту, типу продукта и цене
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#e4eaec',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <PlusOutlined style={{ fontSize: '40px', color: '#0d94db' }} />
              </div>
              <Title level={4} style={{ marginBottom: '16px' }}>
                Простое размещение
              </Title>
              <Paragraph style={{ fontSize: '16px', color: '#5e6669' }}>
                Создайте заказ за несколько минут и получите предложения от проверенных перевозчиков
              </Paragraph>
            </div>
          </Col>
        </Row>
      </div>

      {/* CTA Section */}
      <div
        style={{
          background: '#e4eaec',
          padding: '60px 50px',
          textAlign: 'center',
        }}
      >
        <Title level={2} style={{ marginBottom: '24px', color: '#4c545c' }}>
          Готовы начать?
        </Title>
        <Paragraph style={{ fontSize: '18px', color: '#5e6669', marginBottom: '32px' }}>
          Присоединяйтесь к нашей платформе и находите лучшие предложения
        </Paragraph>
        <Space size="large">
          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/ads')}
            style={{ height: '48px', padding: '0 32px' }}
          >
            Посмотреть объявления
          </Button>
          {!isAuthenticated && (
            <Button
              size="large"
              onClick={() => navigate('/register')}
              style={{ height: '48px', padding: '0 32px' }}
            >
              Зарегистрироваться
            </Button>
          )}
        </Space>
      </div>
    </div>
  );
};
