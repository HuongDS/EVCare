// src/features/chat/components/ChatWindow.tsx
import { useState, useEffect, useRef } from "react";
import { Input, Button } from "antd";
import { useChat } from "../../../hooks/useChat";
import { SendOutlined } from "@ant-design/icons";
import { getHistory } from "../../../services/chatService";
import type { HistoryMessage } from "../../../models/Message/HistoryMessage";

interface ChatWindowProps {
  conversationId: number;
  accountId: number;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, accountId }) => {
  const { messages, send, startTyping, stopTyping } = useChat(conversationId);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryMessage[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const data = await getHistory(conversationId);
      setHistory(data);
    })();
  }, [conversationId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await send(input);
    setInput("");
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, history]);

  return (
    <div className="flex flex-col h-full bg-white border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {[...history, ...messages].map((m, idx) => (
          <div
            key={idx}
            className={`max-w-[75%] px-3 py-2 rounded-xl ${
              m.senderId === accountId ? "bg-green-100 ml-auto" : "bg-gray-100"
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="p-3 border-t flex gap-2 items-center">
        <Input.TextArea
          value={input}
          autoSize={{ minRows: 1, maxRows: 3 }}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          onFocus={startTyping}
          onBlur={stopTyping}
          placeholder="Nhập tin nhắn..."
        />
        <Button icon={<SendOutlined />} type="primary" onClick={handleSend} />
      </div>
    </div>
  );
};
