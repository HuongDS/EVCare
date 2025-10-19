import { ChatSidebar } from "./ChatSideBar";
import { ChatWindow } from "./ChatWindow";
import { useEffect, useState } from "react";
import { Layout, message, Badge } from "antd";
import type { Conversation } from "../../../models/Message/Conversation";
import { useSelector } from "react-redux";
import type { RootState } from "../../../states/store";
import { getChatConnection } from "../../../signalr/chatConnection";
import { CustomerServiceOutlined, BellOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;

export const StaffChatPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState("");
  const connection = getChatConnection();
  const accountId = useSelector((state: RootState) => state.auth.user?.accountId);

  useEffect(() => {
    if (!connection) return;
    connection.on("NewConsultation", (conv) => {
      message.success({
        content: "Bạn có cuộc tư vấn mới!",
        icon: <BellOutlined className="text-blue-500" />,
        duration: 3,
      });
      setConversations((prev) => [conv, ...prev]);
    });
  }, [connection]);

  return (
    <Layout className="chat-layout" style={{ height: "100vh" }}>
      <Sider width={320} className="chat-sider">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="staff-chat-header">
            <h2 className="staff-chat-title">
              <CustomerServiceOutlined />
              Hỗ trợ khách hàng
            </h2>
            <div className="staff-status-indicator">
              <Badge status="processing" />
              <span>Sẵn sàng hỗ trợ</span>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            <ChatSidebar
              accountId={accountId?.toString() || ""}
              conversations={conversations}
              selectedId={selected}
              onSelect={(c) => setSelected(c.id)}
            />
          </div>
        </div>
      </Sider>

      <Content className="chat-content">
        {selected ? (
          <div className="chat-content-wrapper">
            <ChatWindow accountId={accountId?.toString() || ""} conversationId={selected} />
          </div>
        ) : (
          <div className="chat-welcome-state">
            <div className="chat-welcome-icon-wrapper">
              <CustomerServiceOutlined className="chat-welcome-icon" />
            </div>
            <h3 className="chat-welcome-title">Sẵn sàng hỗ trợ</h3>
            <p className="chat-welcome-description">
              Đang chờ khách hàng bắt đầu tư vấn. Hãy chọn một cuộc trò chuyện từ danh sách bên trái.
            </p>
          </div>
        )}
      </Content>
    </Layout>
  );
};
