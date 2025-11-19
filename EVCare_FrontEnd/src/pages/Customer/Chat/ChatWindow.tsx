import { useState, useEffect, useRef } from "react";
import { Input, Button, Avatar, Spin } from "antd";
import { useChat } from "../../../hooks/useChat";
import { SendOutlined, UserOutlined, SmileOutlined, ArrowLeftOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { getHistory } from "../../../services/chatService";
import type { HistoryMessage } from "../../../models/Message/HistoryMessage";
import { RoleEnum } from "../../../models/enums";
import { useSelector } from "react-redux";
import type { RootState } from "../../../states/store";
import type { Conversation } from "../../../models/Message/Conversation";

interface ChatWindowProps {
  conversationId: string;
  accountId: string;
  onBack?: () => void;
  isWidgetMode?: boolean;
  setLastMessage?: (conversationId: string, newMessage: HistoryMessage) => void;
  selectedConversation: Conversation | null;
  isStaffAvailable?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  accountId,
  isWidgetMode,
  onBack,
  setLastMessage,
  selectedConversation,
  isStaffAvailable = true,
}) => {
  const { messages, send } = useChat(conversationId);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const role = useSelector((state: RootState) => state.auth.user?.role);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getHistory(conversationId);
      setHistory(data);
      setLoading(false);
    })();
  }, [conversationId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setInput("");
    await send(input);
  };

  useEffect(() => {
    if (messages.length > 0) {
      const newMessage = messages[messages.length - 1];
      const lastMsg: HistoryMessage = {
        id: newMessage.id.toString(),
        text: newMessage.text ?? "",
        senderId: newMessage.senderId.toString(),
        sentAt: newMessage.sentAt ?? "",
        attachments: newMessage.attachments ?? [],
        receiverId: newMessage.receiverId?.toString() ?? "",
      };
      setLastMessage && setLastMessage(conversationId, lastMsg);
    }
  }, [messages, conversationId, setLastMessage, send]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, history]);

  const formatMessageTime = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const day = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return `${time}, ${day}`;
  };

  const allMessages = [...history, ...messages];

  return (
    <div className="chat-window">
      <div className="chat-header">
        {isWidgetMode && onBack && (
          <Button
            className="chat-header-back-btn"
            type="text"
            shape="circle"
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
          />
        )}
        <div className="chat-header-content">
          <Avatar
            size={40}
            icon={<UserOutlined />}
            src={selectedConversation?.participants[1]?.employeeImage}
            className="chat-header-avatar"
          />
          <div>
            <h3 className="chat-header-title">
              {role === RoleEnum.STAFF
                ? `Customer #${selectedConversation?.participants[0]?.name}`
                : `Staff #${
                    selectedConversation && selectedConversation.participants[1]?.name
                      ? selectedConversation.participants[1]?.name
                      : "EVCare Assistant"
                  }`}
            </h3>
            <p className="chat-header-status" style={{ color: isStaffAvailable ? "#00ad4e" : "#ef4444" }}>
              {isStaffAvailable ? "Active" : "Staff Offline"}
            </p>
          </div>
        </div>
      </div>

      {isStaffAvailable ? (
        <>
          <div className="chat-messages-area">
            {loading ? (
              <div className="chat-loading">
                <Spin size="large" />
              </div>
            ) : allMessages.length === 0 ? (
              <div className="chat-empty-state">
                <SmileOutlined className="chat-empty-icon" />
                <p>Start your conversation</p>
              </div>
            ) : (
              <>
                <div className="chat-messages-container">
                  {allMessages.map((m, idx) => {
                    const isOwn = m.senderId === accountId;
                    return (
                      <div key={idx} className={`message-wrapper ${isOwn ? "own" : "other"}`}>
                        <div className={`message-content ${isOwn ? "own" : "other"}`}>
                          <Avatar
                            size={32}
                            icon={<UserOutlined />}
                            className="message-avatar"
                            style={{ backgroundColor: isOwn ? "#00ad4e" : "#9ca3af" }}
                          />
                          <div className={`message-bubble-container ${isOwn ? "own" : "other"}`}>
                            <div className={`message-bubble ${isOwn ? "own" : "other"}`}>
                              <p className="message-text">{m.text}</p>
                            </div>
                            <span className="message-timestamp">{formatMessageTime(m.sentAt)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div ref={endRef} />
              </>
            )}
          </div>

          <div className="chat-input-area">
            <div className="chat-input-container">
              <div className="chat-input-field">
                <Input.TextArea
                  value={input}
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  onChange={(e) => setInput(e.target.value)}
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Input your message..."
                />
              </div>
              <Button
                icon={<SendOutlined />}
                type="primary"
                onClick={handleSend}
                disabled={!input.trim()}
                className="btn-send-message"
                size="large"
              >
                Send
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="chat-offline-message">
          <InfoCircleOutlined style={{ fontSize: "48px", color: "#6b7280" }} />
          <h3 className="chat-offline-title">Staff is currently unavailable</h3>
          <p>
            Currently, the staff is unavailable. We kindly ask customers to reach out later, or if there is an urgent
            matter, please email the center directly.
          </p>
          <Button type="primary" onClick={onBack} style={{ marginTop: "1rem" }}>
            Back
          </Button>
        </div>
      )}
    </div>
  );
};
