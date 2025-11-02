import { List, Badge, Avatar } from "antd";
import { UserOutlined, ClockCircleOutlined } from "@ant-design/icons";
import type { Conversation } from "../../../models/Message/Conversation";
import { useSelector } from "react-redux";
import { RoleEnum } from "../../../models/enums";
import type { RootState } from "../../../states/store";

interface ChatSidebarProps {
  conversations: Conversation[];
  onSelect: (conv: Conversation) => void;
  accountId: string;
  selectedId?: string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ conversations, onSelect, accountId, selectedId }) => {
  const role = useSelector((state: RootState) => state.auth.user?.role);

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours`;
    return `${Math.floor(diffMins / 1440)} days`;
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
                    size={40}
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
                    {role === RoleEnum.STAFF
                      ? `Customer #${item.participants[0]?.name}`
                      : `Staff #${
                          item.participants[1]?.name == null ? "EVCare Assistant" : item.participants[1]?.name
                        }`}
                  </span>
                  <span className="conversation-time">
                    <ClockCircleOutlined />
                    {formatTime(item.lastMessage?.sentAt)}
                  </span>
                </div>
              }
              description={
                <div className={`conversation-preview ${unreadCount > 0 ? "unread" : ""}`}>
                  {item.lastMessage?.text || "No messages yet."}
                </div>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};
