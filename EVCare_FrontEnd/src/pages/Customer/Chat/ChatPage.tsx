// ChatPage.tsx
import { useEffect, useState } from "react";
import { Button, Modal, Input, Spin, Tooltip } from "antd";
import {
  MessageOutlined,
  PlusOutlined,
  RobotOutlined,
  UserSwitchOutlined,
  ArrowLeftOutlined, // <-- Thêm icon Back
} from "@ant-design/icons";
import type { Conversation } from "../../../models/Message/Conversation";
import {
  listConversations,
  startConsultation,
  checkUserHasAppointment,
  startChatWithAi,
} from "../../../services/chatService";
import { ChatSidebar } from "./ChatSideBar";
import { ChatWindow } from "./ChatWindow";
import type { RootState } from "../../../states/store";
import { useSelector } from "react-redux";
import { RoleEnum } from "../../../models/enums";
import { WidgetChatStyleWrapper } from "./WidgetChat.styled";
import { useNotification } from "../../../context/useNotification";

// const { Sider, Content } = Layout; // <-- KHÔNG CẦN Sider/Content nữa

interface ChatPageProps {
  isWidgetMode?: boolean;
}

// Định nghĩa các view
type ChatView = "loading" | "list" | "chat" | "new_choice";

export const ChatPage: React.FC<ChatPageProps> = ({ isWidgetMode = false }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState(""); // ID của chat đang chọn
  const [view, setView] = useState<ChatView>("loading"); // State quản lý view
  const [modalOpen, setModalOpen] = useState(false);
  const [consultTopic, setConsultTopic] = useState("");
  const [hasAppointment, setHasAppointment] = useState(false);

  const accountId = useSelector((state: RootState) => state.auth.user?.accountId);
  const role = useSelector((state: RootState) => state.auth.user?.role);

  const notification = useNotification();

  // Load ban đầu
  useEffect(() => {
    (async () => {
      setView("loading");
      try {
        const [list, hasAppt] = await Promise.all([listConversations(), checkUserHasAppointment()]);
        setConversations(list);
        setHasAppointment(hasAppt);

        // Quyết định view ban đầu
        if (list && list.length > 0) {
          setView("list"); // Có hội thoại -> vào danh sách
        } else {
          setView("new_choice"); // Chưa có -> vào màn hình chọn
        }
      } catch (error) {
        console.error("Failed to load chat data:", error);
        setView("new_choice");
      }
    })();
  }, []);

  // Hàm bắt đầu chat (nhân viên)
  const handleStartStaffConsult = async () => {
    try {
      const { conversationId } = await startConsultation();
      const newList = await listConversations();
      setConversations(newList);
      setModalOpen(false);
      setConsultTopic("");

      // Chuyển view
      setSelectedId(conversationId);
      setView("chat");
    } catch (error) {
      notification.error({
        message: "Error",
        description: (error as Error).message || "Failed to start consultation",
      });
    }
  };

  const handleStartAIChat = async () => {
    try {
      const response = await startChatWithAi();
      const newList = await listConversations();
      setConversations(newList);
      setModalOpen(false);
      setConsultTopic("");
      setSelectedId(response.data ?? "");
      setView("chat");
    } catch (error) {
      notification.error({
        message: "Error",
        description: (error as Error).message || "Failed to start consultation",
      });
    }
  };

  // === Các hàm điều hướng ===
  const handleSelectConversation = (conv: Conversation) => {
    setSelectedId(conv.id);
    setView("chat");
  };

  const handleBackToList = () => {
    setSelectedId("");
    setView("list");
  };

  const handleGoToNewChoice = () => {
    setView("new_choice");
  };

  // === Các component con render view ===
  const LoadingState = () => (
    <div
      className="chat-loading"
      style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Spin size="large" />
    </div>
  );

  // Màn hình Lựa chọn (Welcome)
  const WelcomeAndChoiceState = () => (
    <div className="chat-welcome-state">
      {/* Nút back, chỉ hiện khi có ds chat và ở chế độ widget */}
      {isWidgetMode && conversations.length > 0 && (
        <Button
          className="chat-header-back-btn"
          type="text"
          shape="circle"
          icon={<ArrowLeftOutlined />}
          onClick={handleBackToList}
        />
      )}
      <div className="chat-welcome-icon-wrapper">
        <MessageOutlined className="chat-welcome-icon" />
      </div>
      <h3 className="chat-welcome-title">Chào mừng đến EVCare</h3>
      <p className="chat-welcome-description">Bạn cần hỗ trợ? Vui lòng chọn một hình thức tư vấn:</p>
      <div className="chat-choice-buttons">
        <Button icon={<RobotOutlined />} size="large" className="btn-choice-ai" onClick={handleStartAIChat}>
          Chat với AI
        </Button>
        <Tooltip title={!hasAppointment ? "Bạn cần đặt lịch hẹn trước để chat với nhân viên" : ""}>
          <Button
            icon={<UserSwitchOutlined />}
            size="large"
            type="primary"
            className="btn-choice-staff"
            onClick={() => setModalOpen(true)}
            disabled={!hasAppointment}
          >
            Gặp nhân viên tư vấn
          </Button>
        </Tooltip>
      </div>
    </div>
  );

  // Màn hình Danh sách hội thoại
  const ConversationListState = () => (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="chat-sidebar-header">
        <h2 className="chat-sidebar-title">
          <MessageOutlined />
          <span>Tin nhắn</span>
        </h2>
        {role === RoleEnum.CUSTOMER && (
          <Tooltip title="Tư vấn mới">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleGoToNewChoice} // Bấm + ra màn hình lựa chọn
              className="btn-new-chat-widget"
              shape={isWidgetMode ? "circle" : "default"}
              size={isWidgetMode ? "middle" : "large"}
            >
              {!isWidgetMode && "Tư vấn mới"}
            </Button>
          </Tooltip>
        )}
      </div>
      <div style={{ flex: 1, overflowY: "auto", borderTop: "1px solid #f0f0f0" }}>
        <ChatSidebar
          accountId={accountId?.toString() ?? ""}
          conversations={conversations}
          selectedId={selectedId} // Chỉ dùng để highlight
          onSelect={handleSelectConversation} // Bấm item -> chuyển view
        />
      </div>
    </div>
  );

  // === Render chính ===
  const renderView = () => {
    switch (view) {
      case "loading":
        return <LoadingState />;
      case "list":
        return <ConversationListState />;
      case "new_choice":
        return <WelcomeAndChoiceState />;
      case "chat":
        return (
          <ChatWindow
            accountId={accountId?.toString() ?? ""}
            conversationId={selectedId}
            onBack={handleBackToList} // Prop để quay lại
            isWidgetMode={isWidgetMode} // Prop để biết có hiện nút back ko
          />
        );
      default:
        return <WelcomeAndChoiceState />;
    }
  };

  return (
    <WidgetChatStyleWrapper
      style={{ height: "100%" }}
      className={isWidgetMode ? "chat-widget-mode" : "chat-fullpage-mode"}
    >
      <div className="chat-layout" style={{ height: "100%" }}>
        {renderView()}
      </div>

      {/* Modal vẫn giữ nguyên */}
      <Modal
        className="consultation-modal"
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.125rem", fontWeight: 600 }}>
            <UserSwitchOutlined style={{ color: "#00ad4e" }} />
            <span>Bắt đầu tư vấn (Nhân viên)</span>
          </div>
        }
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setConsultTopic("");
        }}
        onOk={handleStartStaffConsult}
        okText="Bắt đầu ngay"
        cancelText="Hủy"
        okButtonProps={{
          className: "btn-send-message",
          size: "large",
        }}
        cancelButtonProps={{ size: "large" }}
      >
        <div style={{ padding: "1.5rem 0 0.5rem" }}>
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
    </WidgetChatStyleWrapper>
  );
};
