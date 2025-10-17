// src/features/chat/pages/ChatPage.tsx
import { useEffect, useState } from "react";
import { Button, Modal, Input, Layout } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import type { Conversation } from "../../../models/Message/Conversation";
import { listConversations, startConsultation } from "../../../services/chatService";
import { ChatSidebar } from "./ChatSideBar";
import { ChatWindow } from "./ChatWindow";
import type { RootState } from "../../../states/store";
import { useSelector } from "react-redux";

const { Sider, Content } = Layout;

export const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const accountId = useSelector((state: RootState) => state.auth.user?.accountId);

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
  };

  return (
    <Layout className="h-[calc(100vh-80px)] border rounded-lg overflow-hidden">
      <Sider width={300} className="bg-white border-r p-2 flex flex-col">
        <Button type="primary" icon={<MessageOutlined />} onClick={() => setModalOpen(true)} className="mb-3">
          Tư vấn ngay
        </Button>
        <ChatSidebar accountId={accountId ?? 0} conversations={conversations} onSelect={(c) => setSelected(c.id)} />
      </Sider>

      <Content className="p-0 flex-1 bg-gray-50">
        {selected ? (
          <ChatWindow accountId={accountId ?? 0} conversationId={selected} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Chọn cuộc trò chuyện hoặc nhấn “Tư vấn ngay”
          </div>
        )}
      </Content>

      <Modal
        title="Bắt đầu tư vấn"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleStartConsult}
        okText="Bắt đầu"
      >
        <Input placeholder="Nhập chủ đề tư vấn..." />
      </Modal>
    </Layout>
  );
};
