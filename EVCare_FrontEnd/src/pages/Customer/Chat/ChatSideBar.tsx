// src/features/chat/components/ChatSidebar.tsx
import { List, Badge, Avatar } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import type { Conversation } from "../../../models/Message/Conversation";

interface ChatSidebarProps {
  conversations: Conversation[];
  onSelect: (conv: Conversation) => void;
  accountId: number;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ conversations, onSelect, accountId }) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={conversations}
      renderItem={(item) => (
        <List.Item onClick={() => onSelect(item)} className="cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-md">
          <List.Item.Meta
            avatar={<Avatar icon={<MessageOutlined />} />}
            title={
              <div className="flex justify-between items-center">
                <span>{item.type === "consultation" ? "Tư vấn" : "Trao đổi đơn hàng"}</span>
                {item.unread[accountId] > 0 && <Badge count={item.unread[accountId]} />}
              </div>
            }
            description={item.lastMessage || "Không có tin nhắn"}
          />
        </List.Item>
      )}
    />
  );
};
