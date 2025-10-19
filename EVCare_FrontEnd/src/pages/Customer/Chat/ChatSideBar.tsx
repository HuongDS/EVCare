import { List, Badge, Avatar } from "antd";
import { UserOutlined, ClockCircleOutlined } from "@ant-design/icons";
import type { Conversation } from "../../../models/Message/Conversation";

interface ChatSidebarProps {
  conversations: Conversation[];
  onSelect: (conv: Conversation) => void;
  accountId: string;
  selectedId?: string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ conversations, onSelect, accountId, selectedId }) => {
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} giờ`;
    return `${Math.floor(diffMins / 1440)} ngày`;
  };

  return (
    <List
      className="chat-sidebar-list"
      itemLayout="horizontal"
      dataSource={conversations}
      renderItem={(item) => {
        const isSelected = item.id === selectedId;
        const unreadCount = item.unread[Number(accountId)] || 0;

        return (
          <List.Item onClick={() => onSelect(item)} className={`${isSelected ? "selected" : ""}`}>
            <List.Item.Meta
              avatar={
                <div className="conversation-avatar-wrapper">
                  <Avatar
                    size={48}
                    icon={<UserOutlined />}
                    className={`conversation-avatar ${isSelected ? "selected" : ""}`}
                  />
                  {unreadCount > 0 && (
                    <div className="conversation-unread-badge">
                      <Badge count={unreadCount} />
                    </div>
                  )}
                </div>
              }
              title={
                <div className="conversation-title">
                  <span className={`conversation-name ${isSelected ? "selected" : ""}`}>
                    {`User #${item.participants[1]?.accountId}`}
                  </span>
                  <span className="conversation-time">
                    <ClockCircleOutlined />
                    {formatTime(item.lastMessage?.sentAt)}
                  </span>
                </div>
              }
              description={
                <div className={`conversation-preview ${unreadCount > 0 ? "unread" : ""}`}>
                  {item.lastMessage?.text || "Chưa có tin nhắn"}
                </div>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};
