import { useEffect, useState } from "react";
import { Button, Modal, Input, Layout } from "antd";
import { MessageOutlined, PlusOutlined } from "@ant-design/icons";
import type { Conversation } from "../../../models/Message/Conversation";
import { listConversations, startConsultation } from "../../../services/chatService";
import { ChatSidebar } from "./ChatSideBar";
import { ChatWindow } from "./ChatWindow";
import type { RootState } from "../../../states/store";
import { useSelector } from "react-redux";
import { RoleEnum } from "../../../models/enums";
import { ChatStyleWrapper } from "./Chat.styled";

const { Sider, Content } = Layout;

export const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [consultTopic, setConsultTopic] = useState("");
  const accountId = useSelector((state: RootState) => state.auth.user?.accountId);
  const role = useSelector((state: RootState) => state.auth.user?.role);

  useEffect(() => {
    (async () => {
      const list = await listConversations();
      setConversations(list);
    })();
  }, []);

  const handleStartConsult = async () => {
    const { conversationId } = await startConsultation();
    setSelected(conversationId);
    setModalOpen(false);
    setConsultTopic("");
  };

  return (
    <ChatStyleWrapper>
      <Layout className="chat-layout">
        <Sider width={320} className="chat-sider">
          <div className="height: 100vh; display: flex; flex-direction: column;">
            <div className="chat-sidebar-header">
              <h2 className="chat-sidebar-title">
                <MessageOutlined />
                Tin nhắn
              </h2>
              {role === RoleEnum.CUSTOMER && conversations.length === 0 && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setModalOpen(true)}
                  className="btn-new-consultation"
                  size="large"
                >
                  Tư vấn ngay
                </Button>
              )}
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              <ChatSidebar
                accountId={accountId?.toString() ?? ""}
                conversations={conversations}
                selectedId={selected}
                onSelect={(c) => setSelected(c.id)}
              />
            </div>
          </div>
        </Sider>

        <Content className="chat-content">
          {selected ? (
            <ChatWindow accountId={accountId?.toString() ?? ""} conversationId={selected} />
          ) : (
            <div className="chat-welcome-state">
              <div className="chat-welcome-icon-wrapper">
                <MessageOutlined className="chat-welcome-icon" />
              </div>
              <h3 className="chat-welcome-title">Chào mừng đến với Tư vấn</h3>
              <p className="chat-welcome-description">
                Chọn một cuộc trò chuyện từ danh sách bên trái hoặc bắt đầu tư vấn mới để được hỗ trợ
              </p>
            </div>
          )}
        </Content>

        <Modal
          className="consultation-modal"
          title={
            <div className="flex items-center gap-2 text-lg">
              <MessageOutlined className="text-blue-500" />
              <span>Bắt đầu tư vấn mới</span>
            </div>
          }
          open={modalOpen}
          onCancel={() => {
            setModalOpen(false);
            setConsultTopic("");
          }}
          onOk={handleStartConsult}
          okText="Bắt đầu ngay"
          cancelText="Hủy"
          okButtonProps={{
            className: "bg-gradient-to-r from-blue-500 to-indigo-600 border-0 h-10",
            size: "large",
          }}
          cancelButtonProps={{ size: "large" }}
        >
          <div className="py-4">
            <label className="consultation-modal-label">Chủ đề tư vấn (tùy chọn)</label>
            <Input.TextArea
              placeholder="Ví dụ: Tư vấn về sản phẩm, hỗ trợ kỹ thuật..."
              value={consultTopic}
              onChange={(e) => setConsultTopic(e.target.value)}
              autoSize={{ minRows: 3, maxRows: 6 }}
              className="rounded-lg"
            />
          </div>
        </Modal>
      </Layout>
    </ChatStyleWrapper>
  );
};
