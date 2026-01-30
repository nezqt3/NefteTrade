import React from 'react';
import { Form, Input, Button, Card, Typography, message, Radio } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi, RegisterDto } from '@features/auth/api/authApi';
import { useAuthStore } from '@app/store/authStore';
import { UserRole } from '@entities/user/model/types';

const { Title, Text } = Typography;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const registerMutation = useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      setUser(data.user);
      message.success('Регистрация успешна!');
      navigate('/');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Ошибка регистрации');
    },
  });

  const handleSubmit = (values: RegisterDto) => {
    registerMutation.mutate(values);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e4eaec 0%, #75c0e3 100%)',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '520px',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: '#0d94db', marginBottom: '8px' }}>
            Регистрация
          </Title>
          <Text type="secondary">Создайте новый аккаунт</Text>
        </div>

        <Form
          name="register"
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
          initialValues={{ role: UserRole.CUSTOMER }}
        >
          <Form.Item
            name="role"
            label="Тип аккаунта"
            rules={[{ required: true, message: 'Выберите тип аккаунта' }]}
          >
            <Radio.Group>
              <Radio.Button value={UserRole.CUSTOMER}>Заказчик</Radio.Button>
              <Radio.Button value={UserRole.CONTRACTOR}>Подрядчик</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="name"
            label="Имя"
            rules={[{ required: true, message: 'Введите имя' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#8f9698' }} />}
              placeholder="Иван Иванов"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Введите корректный email' },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#8f9698' }} />}
              placeholder="email@example.com"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Телефон"
            rules={[
              { required: true, message: 'Введите телефон' },
              { pattern: /^[\d\s\+\-\(\)]+$/, message: 'Введите корректный телефон' },
            ]}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: '#8f9698' }} />}
              placeholder="+7 900 123-45-67"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Пароль"
            rules={[
              { required: true, message: 'Введите пароль' },
              { min: 8, message: 'Пароль должен содержать минимум 8 символов' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#8f9698' }} />}
              placeholder="Минимум 8 символов"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Подтвердите пароль"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Подтвердите пароль' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#8f9698' }} />}
              placeholder="Повторите пароль"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={registerMutation.isPending}
            >
              Зарегистрироваться
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              Уже есть аккаунт?{' '}
              <Link to="/login" style={{ color: '#0d94db', fontWeight: 500 }}>
                Войти
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};
