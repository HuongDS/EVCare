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
import { RoleEnum } from "../../../models/enums";

const { Sider, Content } = Layout;

export const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
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
  };

  return (
    <Layout className="h-[calc(100vh-80px)] border rounded-lg overflow-hidden">
      <Sider width={300} className="bg-white border-r p-2 flex flex-col">
        {role == RoleEnum.CUSTOMER && (
          <Button type="primary" icon={<MessageOutlined />} onClick={() => setModalOpen(true)} className="mb-3">
            Tư vấn ngay
          </Button>
        )}
        <ChatSidebar
          accountId={accountId?.toString() ?? ""}
          conversations={conversations}
          onSelect={(c) => setSelected(c.id)}
        />
      </Sider>

      <Content className="p-0 flex-1 bg-gray-50">
        {selected ? (
          <ChatWindow accountId={accountId?.toString() ?? ""} conversationId={selected} />
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
