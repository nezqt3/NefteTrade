import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import "./Chat.css";

export interface Message {
  chatId: string;
  message: string;
  senderId: string;
  created_at: number;
  read: boolean;
}

export function Chat({ chatId, userId }: { chatId: string; userId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const socketRef = useRef<Socket>();

  useEffect(() => {
    socketRef.current = io("http://localhost:4000");

    socketRef.current.emit("joinChat", chatId);

    // 3️⃣ Получение новых сообщений
    socketRef.current.on("newMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [chatId]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const msg: Message = {
      chatId,
      senderId: userId,
      message: inputValue,
      created_at: Date.now(),
      read: false,
    };

    socketRef.current?.emit("sendMessage", msg);

    setInputValue("");
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <>
      {!isOpen && (
        <button className="chat-trigger" onClick={toggleChat}>
          <span className="trigger-icon">💬</span>
          <span className="trigger-badge">1</span>
        </button>
      )}

      {isOpen && (
        <div className="chat-widget">
          <header className="widget-header">
            <div className="user-status">
              <div className="status-dot"></div>
              <strong>Поддержка</strong>
            </div>
            <button className="close-btn" onClick={toggleChat}>
              &times;
            </button>
          </header>

          <div className="widget-body">
            <aside className="mini-sidebar">
              <div className="mini-avatar active"></div>
              <div className="mini-avatar"></div>
            </aside>

            <main className="mini-chat-window">
              <div className="messages-area">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`message ${
                      msg.senderId === userId ? "outgoing" : "incoming"
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
