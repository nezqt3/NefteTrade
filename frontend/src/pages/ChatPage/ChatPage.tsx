import React from 'react';
import { useParams } from 'react-router-dom';
import { Chat } from '@widgets/Chat/Chat';
import './ChatPage.css';

export const ChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = localStorage.getItem('userId') || '';

  return (
    <main className="tg-chat-page tg-page-animate">
      <div className="tg-container tg-chat-page__container">
        <Chat chatId={id} userId={userId} />
      </div>
    </main>
  );
};
