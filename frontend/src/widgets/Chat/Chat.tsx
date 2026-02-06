import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { WS_BASE_URL } from "@shared/api/axios";
import { chatApi } from "@features/chat/api/chatApi";
import { ChatListItem, Message } from "@features/chat/model/types";
import "./Chat.css";

export function Chat({
  chatId,
  userId,
}: {
  chatId?: string;
  userId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(
    chatId || null,
  );
  const [messagesByChat, setMessagesByChat] = useState<
    Record<string, Message[]>
  >({});
  const messages = activeChatId ? messagesByChat[activeChatId] || [] : [];
  const [inputValue, setInputValue] = useState("");
  const totalUnread = chats.reduce(
    (sum, chat) => sum + (chat.unreadCount || 0),
    0,
  );

  const socketRef = useRef<Socket>();
  const activeChatRef = useRef<string | null>(activeChatId);

  useEffect(() => {
    activeChatRef.current = activeChatId;
  }, [activeChatId]);

  useEffect(() => {
    if (!userId) return;
    chatApi
      .getMyChats()
      .then((data) => {
        setChats(data);
        if (!activeChatRef.current && data.length > 0) {
          setActiveChatId(data[0].id);
        }
      })
      .catch(() => {
        setChats([]);
      });
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const socket = io(WS_BASE_URL, {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      if (activeChatRef.current) {
        socket.emit("joinChat", { chatId: activeChatRef.current, userId });
      }
    });

    socket.on(
      "chatHistory",
      ({ chatId: historyChatId, messages }: any) => {
        if (!historyChatId) return;
        setMessagesByChat((prev) => ({
          ...prev,
          [String(historyChatId)]: messages || [],
        }));
      },
    );

    socket.on("newMessage", (msg: Message) => {
      const targetChatId = String(msg.chatId);
      setMessagesByChat((prev) => {
        const existing = prev[targetChatId] || [];
        if (msg.id && existing.some((m) => m.id === msg.id)) return prev;
        return { ...prev, [targetChatId]: [...existing, msg] };
      });

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === targetChatId
            ? {
                ...chat,
                lastMessage: msg,
                unreadCount:
                  activeChatRef.current === targetChatId ||
                  String(msg.senderId) === String(userId)
                    ? chat.unreadCount
                    : chat.unreadCount + 1,
              }
            : chat,
        ),
      );
    });

    socket.on("messagesRead", ({ messageIds, chatId: readChatId }: any) => {
      const targetChatId = String(readChatId || activeChatRef.current || "");
      if (!targetChatId) return;
      setMessagesByChat((prev) => {
        const existing = prev[targetChatId] || [];
        return {
          ...prev,
          [targetChatId]: existing.map((msg) =>
            msg.id !== undefined && messageIds.includes(msg.id)
              ? { ...msg, read: true }
              : msg,
          ),
        };
      });
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === targetChatId ? { ...chat, unreadCount: 0 } : chat,
        ),
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (!messages.length || !activeChatId) return;

    const unreadIds = messages
      .filter(
        (msg) =>
          msg.id !== undefined &&
          !msg.read &&
          String(msg.senderId) !== String(userId),
      )
      .map((msg) => msg.id!);

    if (unreadIds.length) {
      socketRef.current?.emit("markAsRead", {
        chatId: activeChatId,
        messageIds: unreadIds,
        userId,
      });
    }
  }, [messages, activeChatId, userId]);

  useEffect(() => {
    if (!chatId) return;
    setActiveChatId(chatId);
    setIsOpen(true);
    if (!chats.find((c) => c.id === chatId)) {
      chatApi.getMyChats().then(setChats).catch(() => null);
    }
  }, [chatId, chats]);

  useEffect(() => {
    if (!activeChatId || !socketRef.current) return;
    socketRef.current.emit("joinChat", { chatId: activeChatId, userId });
  }, [activeChatId, userId]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    if (!activeChatId) return;

    const msg: Message = {
      chatId: activeChatId,
      senderId: userId,
      message: inputValue.trim(),
      created_at: Date.now(),
      read: false,
    };

    socketRef.current?.emit("sendMessage", msg);

    setInputValue("");
  };

  return (
    <>
      {!isOpen && (
        <button className="chat-trigger" onClick={toggleChat}>
          <span className="trigger-icon">💬</span>
          {totalUnread > 0 && (
            <span className="trigger-badge">{totalUnread}</span>
          )}
        </button>
      )}

      {isOpen && (
        <div className="chat-widget">
          <header className="widget-header">
            <div className="user-status">
              <div className="status-dot"></div>
              <strong>Чаты</strong>
            </div>
            <button className="close-btn" onClick={toggleChat}>
              &times;
            </button>
          </header>

          <div className="widget-body">
            <aside className="mini-sidebar">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  className={`mini-avatar ${
                    chat.id === activeChatId ? "active" : ""
                  }`}
                  onClick={() => setActiveChatId(chat.id)}
                  title={`Чат #${chat.id}`}
                >
                  {chat.unreadCount > 0 && (
                    <span className="mini-badge">{chat.unreadCount}</span>
                  )}
                </button>
              ))}
            </aside>

            <main className="mini-chat-window">
              <div className="messages-area">
                {!activeChatId && (
                  <div className="message incoming">
                    Выберите чат слева
                  </div>
                )}
                {activeChatId &&
                  messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`message ${
                      String(msg.senderId) === String(userId)
                        ? "outgoing"
                    : "incoming"
                }`}
                  >
                    {msg.message}
                  </div>
                ))}
              </div>

              <footer className="input-area">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  type="text"
                  placeholder="Сообщение..."
                />
                <button className="send-icon" onClick={sendMessage}>
                  ➤
                </button>
              </footer>
            </main>
          </div>
        </div>
      )}
    </>
  );
}
