// StaffChatPage.tsx
import { ChatSidebar } from "./ChatSideBar";
import { ChatWindow } from "./ChatWindow";
import { useEffect, useState } from "react";
import { Layout, message } from "antd";
import type { Conversation } from "../../../models/Message/Conversation";
import { useSelector } from "react-redux";
import type { RootState } from "../../../states/store";
import { getChatConnection } from "../../../signalr/chatConnection";

const { Sider, Content } = Layout;

export const StaffChatPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState("");
  const connection = getChatConnection();
  const accountId = useSelector((state: RootState) => state.auth.user?.accountId);

  useEffect(() => {
    if (!connection) return;
    connection.on("NewConsultation", (conv) => {
      message.info(`Bạn có cuộc tư vấn mới:`);
      setConversations((prev) => [conv, ...prev]);
    });
  }, [connection]);

  return (
    <Layout className="h-[calc(100vh-80px)] border rounded-lg overflow-hidden">
      <Sider width={300} className="bg-white border-r p-2">
        <ChatSidebar
          accountId={accountId?.toString() || ""}
          conversations={conversations}
          onSelect={(c) => setSelected(c.id)}
        />
      </Sider>

      <Content className="p-0 flex-1 bg-gray-50">
        {selected ? (
          <ChatWindow accountId={accountId?.toString() || ""} conversationId={selected} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">Chờ khách hàng bắt đầu tư vấn...</div>
        )}
      </Content>
    </Layout>
  );
};
