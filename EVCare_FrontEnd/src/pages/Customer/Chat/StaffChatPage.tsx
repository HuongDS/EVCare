import { ChatSidebar } from "./ChatSideBar";
import { ChatWindow } from "./ChatWindow";
import { useCallback, useEffect, useState } from "react";
import { Layout, message, Badge, Spin } from "antd";
import type { Conversation } from "../../../models/Message/Conversation";
import { useSelector } from "react-redux";
import type { RootState } from "../../../states/store";
import { getChatConnection } from "../../../signalr/chatConnection";
import { CustomerServiceOutlined, BellOutlined } from "@ant-design/icons";
import { listConversations } from "../../../services/chatService";
import { StaffChatStyleWrapper } from "./StaffChat.styled";
import type { HistoryMessage } from "../../../models/Message/HistoryMessage";
import { MinimalPagination } from "../../../components/Paginations/MinimalPagination";

const { Sider, Content } = Layout;

export const StaffChatPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState("");
  const connection = getChatConnection();
  const accountId = useSelector((state: RootState) => state.auth.user?.accountId);
  const [loading, setLoading] = useState(true);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await listConversations(pageIndex, pageSize);
        setConversations(list.data?.items ?? []);
        setPageIndex(list.data?.pageIndex ?? 1);
        setTotalItems(list.data?.totalItems ?? 0);
        setTotalPages(list.data?.totalPages ?? 1);
      } catch (err) {
        console.error("Failed to load conversations", err);
        message.error("Can not load list conversation.");
      }
      setLoading(false);
    })();
  }, [pageIndex]);

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

  const handleNewMessage = useCallback(() => {
    (conversationId: string, newMessage: HistoryMessage) => {
      setConversations((prev) => {
        const conTarget = prev.find((c) => c.id === conversationId);
        if (!conTarget) return prev;
        const update = {
          ...conTarget,
          lastMessage: {
            text: newMessage.text,
            sentAt: newMessage.sentAt,
            senderId: newMessage.senderId,
          },
        };

        const oldConvo = prev.filter((c) => c.id !== conversationId);
        return [update, ...oldConvo];
      });
    };
  }, []);

  const handleSelectConversation = (conversationId: string) => {
    setSelected(conversationId);
    const conv = conversations.find((c) => c.id === conversationId) || null;
    setSelectedConv(conv);
  };

  return (
    <StaffChatStyleWrapper className="chat-fullpage-mode" style={{ height: "100%" }}>
      <Layout className="chat-layout" style={{ height: "100%" }}>
        <Sider width={320} className="chat-sider">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="staff-chat-header">
              <h2 className="staff-chat-title">
                <CustomerServiceOutlined />
                Customer support
              </h2>
              <div className="staff-status-indicator">
                <Badge status="processing" />
                <span>Ready to support</span>
              </div>
            </div>

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
                  onSelect={(c) => handleSelectConversation(c.id)}
                />
              )}
            </div>

            {totalItems > pageSize && (
              <div
                style={{
                  padding: "10px 5px",
                  borderTop: "1px solid #f0f0f0",
                  backgroundColor: "#fff",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div style={{ transform: "scale(0.85)", transformOrigin: "bottom center" }}>
                  <MinimalPagination pageIndex={pageIndex} totalPage={totalPages} onPageChange={setPageIndex} />
                </div>
              </div>
            )}
          </div>
        </Sider>

        <Content className="chat-content">
          {selected ? (
            <div className="chat-content-wrapper" style={{ height: "100%" }}>
              <ChatWindow
                accountId={accountId?.toString() || ""}
                conversationId={selected}
                isWidgetMode={false}
                setLastMessage={handleNewMessage}
                selectedConversation={selectedConv}
              />
            </div>
          ) : (
            <div className="chat-welcome-state" style={{ height: "100%" }}>
              <div className="chat-welcome-icon-wrapper">
                <CustomerServiceOutlined className="chat-welcome-icon" />
              </div>
              <h3 className="chat-welcome-title">Ready to support</h3>
              <p className="chat-welcome-description">
                Waiting for the customer to start a consultation. Please select a conversation from the left list.
              </p>
            </div>
          )}
        </Content>
      </Layout>
    </StaffChatStyleWrapper>
  );
};
