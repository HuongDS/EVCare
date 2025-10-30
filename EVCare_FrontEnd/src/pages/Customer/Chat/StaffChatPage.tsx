import { ChatSidebar } from "./ChatSideBar";
import { ChatWindow } from "./ChatWindow";
import { useEffect, useState } from "react";
import { Layout, message, Badge, Spin } from "antd";
import type { Conversation } from "../../../models/Message/Conversation";
import { useSelector } from "react-redux";
import type { RootState } from "../../../states/store";
import { getChatConnection } from "../../../signalr/chatConnection";
import { CustomerServiceOutlined, BellOutlined } from "@ant-design/icons";
import { listConversations } from "../../../services/chatService";
import { StaffChatStyleWrapper } from "./StaffChat.styled";

const { Sider, Content } = Layout;

export const StaffChatPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState("");
  const connection = getChatConnection();
  const accountId = useSelector((state: RootState) => state.auth.user?.accountId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await listConversations();
        setConversations(list);
      } catch (err) {
        console.error("Failed to load conversations", err);
        message.error("Không thể tải danh sách trò chuyện.");
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!connection) return;
    connection.on("NewConsultation", (conv) => {
      message.success({
        content: "You have a new consultation!",
        icon: <BellOutlined style={{ color: "#00ad4e" }} />,
        duration: 3,
      });
      setConversations((prev) => [conv, ...prev]);
    });
  }, [connection]);

  return (
    <StaffChatStyleWrapper className="chat-fullpage-mode" style={{ height: "100%" }}>
      <Layout className="chat-layout" style={{ height: "100%" }}>
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
              {loading ? (
                <div
                  className="chat-loading"
                  style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Spin size="large" />
                </div>
              ) : (
                <ChatSidebar
                  accountId={accountId?.toString() || ""}
                  conversations={conversations}
                  selectedId={selected}
                  onSelect={(c) => setSelected(c.id)}
                />
              )}
            </div>
          </div>
        </Sider>

        <Content className="chat-content">
          {selected ? (
            <div className="chat-content-wrapper" style={{ height: "100%" }}>
              <ChatWindow accountId={accountId?.toString() || ""} conversationId={selected} isWidgetMode={false} />
            </div>
          ) : (
            <div className="chat-welcome-state" style={{ height: "100%" }}>
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
    </StaffChatStyleWrapper>
  );
};
