import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Badge } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  PlusOutlined,
  MessageOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@app/store/authStore';
import { UserRole } from '@entities/user/model/types';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Профиль',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'my-ads',
      icon: <FileTextOutlined />,
      label: 'Мои объявления',
      onClick: () => navigate('/my-ads'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Выйти',
      onClick: handleLogout,
      danger: true,
    },
  ];

  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">Главная</Link>,
    },
    {
      key: '/ads',
      icon: <FileTextOutlined />,
      label: <Link to="/ads">Объявления</Link>,
    },
  ];

  if (isAuthenticated && user?.role === UserRole.CUSTOMER) {
    menuItems.push({
      key: '/create-ad',
      icon: <PlusOutlined />,
      label: <Link to="/create-ad">Создать заказ</Link>,
    });
  }

  if (isAuthenticated && user?.role === UserRole.CONTRACTOR) {
    menuItems.push({
      key: '/messages',
      icon: <MessageOutlined />,
      label: (
        <Link to="/messages">
          <Badge count={0} offset={[10, 0]}>
            Сообщения
          </Badge>
        </Link>
      ),
    });
  }

  return (
    <AntHeader
      style={{
        background: '#fff',
        padding: '0 50px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#0d94db',
              letterSpacing: '-0.5px',
            }}
          >
            OilTransport
          </div>
        </Link>

        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ flex: 1, border: 'none', minWidth: '400px' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isAuthenticated && user ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Avatar
                icon={<UserOutlined />}
                style={{ backgroundColor: '#0d94db' }}
                src={user.avatar}
              />
              <span style={{ fontWeight: 500 }}>{user.name}</span>
            </div>
          </Dropdown>
        ) : (
          <>
            <Button
              type="default"
              icon={<LoginOutlined />}
              onClick={() => navigate('/login')}
            >
              Войти
            </Button>
            <Button
              type="primary"
              onClick={() => navigate('/register')}
            >
              Регистрация
            </Button>
          </>
        )}
      </div>
    </AntHeader>
  );
};
