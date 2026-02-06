import React from "react";
import { useParams } from "react-router-dom";
import { Chat } from "@widgets/Chat/Chat";

export const ChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = localStorage.getItem("userId") || "";
  const chatId = id || "1";

  return (
    <div style={{ padding: "24px" }}>
      <Chat chatId={chatId} userId={userId} />
    </div>
  );
};
