import { useState, useEffect, useRef } from "react";
import { Input, Button, Avatar, Spin } from "antd";
import { useChat } from "../../../hooks/useChat";
import { SendOutlined, UserOutlined, SmileOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { getHistory } from "../../../services/chatService";
import type { HistoryMessage } from "../../../models/Message/HistoryMessage";
// import { RoleEnum } from "../../../models/enums";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../states/store";

interface ChatWindowProps {
  conversationId: string;
  accountId: string;
  onBack?: () => void;
  isWidgetMode?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, accountId, isWidgetMode, onBack }) => {
  const { messages, send, startTyping, stopTyping } = useChat(conversationId);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  // const role = useSelector((state: RootState) => state.auth.user?.role);

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
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, history]);

  const formatMessageTime = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  const allMessages = [...history, ...messages];

  // const handleEndConversation = () => {
  //   // TODO: Gọi API hoặc SignalR để kết thúc cuộc trò chuyện này
  //   console.log("End conversation:", conversationId);
  //   message.info("Conversation ended.");
  // };

  return (
    <div className="chat-window">
      {/* Chat Header */}
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
          <Avatar size={40} icon={<UserOutlined />} className="chat-header-avatar" />
          <div>
            <h3 className="chat-header-title">Conversation</h3>
            <p className="chat-header-status">Active</p>
          </div>
        </div>

        {/* {role === RoleEnum.STAFF && (
          <Tooltip title="End conversation">
            <Button
              className="btn-end-conversation"
              type="primary"
              danger
              shape="circle"
              onClick={handleEndConversation}
            />
          </Tooltip>
        )} */}
      </div>

      {/* Messages Area */}
      <div className="chat-messages-area">
        {loading ? (
          <div className="chat-loading">
            <Spin size="large" />
          </div>
        ) : allMessages.length === 0 ? (
          <div className="chat-empty-state">
            <SmileOutlined className="chat-empty-icon" />
            <p>Bắt đầu cuộc trò chuyện của bạn</p>
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

      {/* Input Area */}
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
              onFocus={startTyping}
              onBlur={stopTyping}
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
    </div>
  );
};
