import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ArrowLeft, Check, CheckCheck, SendHorizontal } from 'lucide-react';
import { WS_BASE_URL } from '@shared/api/axios';
import { chatApi } from '@features/chat/api/chatApi';
import { ChatListItem, Message } from '@features/chat/model/types';
import './Chat.css';

interface ChatProps {
  chatId?: string;
  userId: string;
}

function toTimestamp(value: number | string | undefined): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : Date.now();
  }
  return Date.now();
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildFallbackReply(activeChatId: string): Message {
  return {
    id: Date.now(),
    chatId: activeChatId,
    senderId: 'partner',
    message: 'Принято, подготовлю детали и отправлю документы в ближайшее время.',
    created_at: Date.now(),
    read: false,
  };
}

export function Chat({ chatId, userId }: ChatProps) {
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(chatId || null);
  const [messagesByChat, setMessagesByChat] = useState<Record<string, Message[]>>({});
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDialogsMobile, setShowDialogsMobile] = useState(!chatId);

  const socketRef = useRef<Socket>();
  const activeChatRef = useRef<string | null>(activeChatId);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const messages = activeChatId ? messagesByChat[activeChatId] || [] : [];

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) || null,
    [chats, activeChatId],
  );

  const totalUnread = useMemo(
    () => chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0),
    [chats],
  );

  useEffect(() => {
    activeChatRef.current = activeChatId;
  }, [activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    chatApi
      .getMyChats()
      .then((data) => {
        const normalized = data.map((chat) => ({
          ...chat,
          lastMessage: chat.lastMessage
            ? {
                ...chat.lastMessage,
                chatId: String(chat.lastMessage.chatId),
                senderId: String(chat.lastMessage.senderId),
                created_at: toTimestamp(chat.lastMessage.created_at as number | string),
              }
            : null,
        }));

        if (chatId && !normalized.find((item) => item.id === chatId)) {
          normalized.unshift({
            id: chatId,
            listingId: chatId,
            senderId: userId,
            receiverId: 'partner',
            createdAt: new Date().toISOString(),
            unreadCount: 0,
            lastMessage: null,
          });
        }

        setChats(normalized);

        if (!activeChatRef.current && normalized.length > 0) {
          setActiveChatId(normalized[0].id);
        }
      })
      .catch(() => {
        setChats([]);
      });
  }, [chatId, userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const socket = io(WS_BASE_URL, {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      if (activeChatRef.current) {
        socket.emit('joinChat', { chatId: activeChatRef.current, userId });
      }
    });

    socket.on('chatHistory', ({ chatId: historyChatId, messages: historyMessages }: { chatId: string; messages: Message[] }) => {
      if (!historyChatId) {
        return;
      }

      setMessagesByChat((prev) => ({
        ...prev,
        [String(historyChatId)]: (historyMessages || []).map((messageItem) => ({
          ...messageItem,
          chatId: String(messageItem.chatId),
          senderId: String(messageItem.senderId),
          created_at: toTimestamp(messageItem.created_at as number | string),
        })),
      }));
    });

    socket.on('newMessage', (messageItem: Message) => {
      const targetChatId = String(messageItem.chatId);
      const normalizedMessage: Message = {
        ...messageItem,
        chatId: targetChatId,
        senderId: String(messageItem.senderId),
        created_at: toTimestamp(messageItem.created_at as number | string),
      };

      setMessagesByChat((prev) => {
        const existing = prev[targetChatId] || [];
        if (normalizedMessage.id && existing.some((msg) => msg.id === normalizedMessage.id)) {
          return prev;
        }
        return {
          ...prev,
          [targetChatId]: [...existing, normalizedMessage],
        };
      });

      setChats((prev) => {
        const hasChat = prev.some((chat) => chat.id === targetChatId);
        if (!hasChat) {
          return [
            {
              id: targetChatId,
              listingId: targetChatId,
              senderId: String(normalizedMessage.senderId),
              receiverId: String(userId),
              createdAt: new Date().toISOString(),
              unreadCount: String(normalizedMessage.senderId) === String(userId) ? 0 : 1,
              lastMessage: normalizedMessage,
            },
            ...prev,
          ];
        }

        return prev.map((chat) =>
          chat.id === targetChatId
            ? {
                ...chat,
                lastMessage: normalizedMessage,
                unreadCount:
                  activeChatRef.current === targetChatId || String(normalizedMessage.senderId) === String(userId)
                    ? chat.unreadCount
                    : chat.unreadCount + 1,
              }
            : chat,
        );
      });
    });

    socket.on('messagesRead', ({ messageIds, chatId: readChatId }: { messageIds: number[]; chatId: string }) => {
      const targetChatId = String(readChatId || activeChatRef.current || '');
      if (!targetChatId) {
        return;
      }

      setMessagesByChat((prev) => ({
        ...prev,
        [targetChatId]: (prev[targetChatId] || []).map((msg) =>
          msg.id !== undefined && messageIds.includes(msg.id) ? { ...msg, read: true } : msg,
        ),
      }));

      setChats((prev) => prev.map((chat) => (chat.id === targetChatId ? { ...chat, unreadCount: 0 } : chat)));
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (!activeChatId || !socketRef.current) {
      return;
    }
    socketRef.current.emit('joinChat', { chatId: activeChatId, userId });
  }, [activeChatId, userId]);

  useEffect(() => {
    if (!activeChatId || !messages.length) {
      return;
    }

    const unreadIds = messages
      .filter((msg) => msg.id !== undefined && !msg.read && String(msg.senderId) !== String(userId))
      .map((msg) => msg.id as number);

    if (unreadIds.length > 0) {
      socketRef.current?.emit('markAsRead', {
        chatId: activeChatId,
        messageIds: unreadIds,
        userId,
      });

      setChats((prev) => prev.map((chat) => (chat.id === activeChatId ? { ...chat, unreadCount: 0 } : chat)));
    }
  }, [activeChatId, messages, userId]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const onSelectChat = (nextChatId: string) => {
    setActiveChatId(nextChatId);
    setShowDialogsMobile(false);
  };

  const sendMessage = (event?: FormEvent) => {
    event?.preventDefault();

    const trimmed = inputValue.trim();
    if (!trimmed || !activeChatId) {
      return;
    }

    const optimisticMessage: Message = {
      id: Date.now(),
      chatId: activeChatId,
      senderId: String(userId),
      message: trimmed,
      created_at: Date.now(),
      read: true,
    };

    setMessagesByChat((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), optimisticMessage],
    }));

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              lastMessage: optimisticMessage,
            }
          : chat,
      ),
    );

    socketRef.current?.emit('sendMessage', {
      chatId: activeChatId,
      senderId: userId,
      message: trimmed,
      created_at: Date.now(),
      read: false,
    });

    setInputValue('');
    setIsTyping(true);

    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      setIsTyping(false);

      const reply = buildFallbackReply(activeChatId);
      setMessagesByChat((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), reply],
      }));

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                lastMessage: reply,
              }
            : chat,
        ),
      );
    }, 1200);
  };

  if (!userId) {
    return <div className="tg-chat-layout tg-chat-layout--empty">Требуется авторизация для доступа к чату.</div>;
  }

  const layoutClassName = `tg-chat-layout ${showDialogsMobile ? 'tg-chat-layout--dialogs-open' : 'tg-chat-layout--chat-open'}`;

  return (
    <section className={layoutClassName}>
      <aside className={`tg-chat-layout__dialogs-column ${showDialogsMobile ? 'tg-chat-layout__dialogs-column--open' : ''}`}>
        <header className="tg-chat-layout__dialogs-header">
          <h1>Сообщения</h1>
          <span className="tg-chat-layout__unread-badge">{totalUnread}</span>
        </header>

        <div className="tg-chat-layout__dialogs-list">
          {chats.map((chat) => {
            const isActive = chat.id === activeChatId;
            const isUnread = chat.unreadCount > 0;
            const preview = chat.lastMessage?.message || 'Откройте чат для переписки';
            const previewTime = chat.lastMessage?.created_at ? formatTime(chat.lastMessage.created_at) : '';

            return (
              <button
                key={chat.id}
                type="button"
                className={`tg-chat-layout__dialog ${isActive ? 'tg-chat-layout__dialog--active' : ''} ${isUnread ? 'tg-chat-layout__dialog--unread' : ''}`}
                onClick={() => onSelectChat(chat.id)}
              >
                <span className="tg-chat-layout__dialog-avatar" aria-hidden="true">
                  {String(chat.id).slice(-2)}
                </span>
                <span className="tg-chat-layout__dialog-content">
                  <span className="tg-chat-layout__dialog-top">
                    <strong>Диалог #{chat.id}</strong>
                    <span>{previewTime}</span>
                  </span>
                  <span className="tg-chat-layout__dialog-message">{preview}</span>
                </span>
                {isUnread && <span className="tg-chat-layout__dialog-dot" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </aside>

      <section className="tg-chat-layout__main-column">
        <header className="tg-chat-layout__chat-header">
          <button className="tg-chat-layout__back-btn" type="button" onClick={() => setShowDialogsMobile(true)}>
            <ArrowLeft size={15} strokeWidth={2.4} />
            Назад
          </button>
          <span className="tg-chat-layout__chat-avatar" aria-hidden="true">
            {activeChat ? String(activeChat.id).slice(-2) : 'TG'}
          </span>
          <div className="tg-chat-layout__chat-user">
            <strong>{activeChat ? `Заказчик #${activeChat.id}` : 'Выберите диалог'}</strong>
            <span className="tg-chat-layout__status">
              <i /> В сети
            </span>
          </div>
        </header>

        <div className="tg-chat-layout__messages">
          {!activeChatId && <p className="tg-chat-layout__placeholder">Выберите диалог слева, чтобы начать переписку.</p>}

          {activeChatId &&
            messages.map((messageItem) => {
              const isOwn = String(messageItem.senderId) === String(userId);
              return (
                <article key={`${messageItem.id || messageItem.created_at}-${messageItem.message}`} className={`tg-chat-layout__message ${isOwn ? 'tg-chat-layout__message--own' : 'tg-chat-layout__message--other'}`}>
                  <p>{messageItem.message}</p>
                  <span className={`tg-chat-layout__message-time ${isOwn ? 'tg-chat-layout__message-time--own' : ''}`}>
                    {formatTime(toTimestamp(messageItem.created_at as number | string))}
                    {isOwn && (
                      <em className="tg-chat-layout__read-icon">
                        {messageItem.read ? <CheckCheck size={12} strokeWidth={2.4} /> : <Check size={12} strokeWidth={2.4} />}
                      </em>
                    )}
                  </span>
                </article>
              );
            })}

          {isTyping && (
            <div className="tg-chat-layout__typing">
              Печатает
              <span>
                <i />
                <i />
                <i />
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="tg-chat-layout__input-zone" onSubmit={sendMessage}>
          <input
            className="tg-chat-layout__input"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Введите сообщение"
            aria-label="Поле ввода сообщения"
          />
          <button className="tg-chat-layout__send-btn" type="submit" aria-label="Отправить сообщение">
            <SendHorizontal size={19} strokeWidth={2.4} />
          </button>
        </form>
      </section>
    </section>
  );
}
