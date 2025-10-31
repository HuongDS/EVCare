import { useEffect, useState } from "react";
import { Button, Modal, Spin, Tooltip, Alert, Space, Radio, List } from "antd";
import { MessageOutlined, PlusOutlined, RobotOutlined, UserSwitchOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import type { Conversation } from "../../../models/Message/Conversation";
import { listConversations, startConsultation, startChatWithAi } from "../../../services/chatService";
import { ChatSidebar } from "./ChatSideBar";
import { ChatWindow } from "./ChatWindow";
import type { RootState } from "../../../states/store";
import { useSelector } from "react-redux";
import { AppointmentStatusEnum, RoleEnum } from "../../../models/enums";
import { WidgetChatStyleWrapper } from "./WidgetChat.styled";
import { useNotification } from "../../../context/useNotification";
import { getCustomerAppointment } from "../../../services/appointmentServiceApi";
import type { AppointmentViewDetailModel } from "../../../models/AppointmentsModel/AppointmentViewDetailModel";
import { Text } from "lucide-react";

interface ChatPageProps {
  isWidgetMode?: boolean;
}

type ChatView = "loading" | "list" | "chat" | "new_choice";

export const ChatPage: React.FC<ChatPageProps> = ({ isWidgetMode = false }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [view, setView] = useState<ChatView>("loading");
  const [modalOpen, setModalOpen] = useState(false);
  const [hasAppointment, setHasAppointment] = useState(false);
  const [allAppointments, setAllAppointments] = useState<AppointmentViewDetailModel[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const accountId = useSelector((state: RootState) => state.auth.user?.accountId);
  const role = useSelector((state: RootState) => state.auth.user?.role);

  const notification = useNotification();

  useEffect(() => {
    (async () => {
      setView("loading");
      try {
        const [list, appointments] = await Promise.all([listConversations(), getCustomerAppointment()]);
        setConversations(list);
        const hasAppt = appointments.data?.filter(
          (a) =>
            a.status !== AppointmentStatusEnum.PENDING &&
            a.status !== AppointmentStatusEnum.CANCELED &&
            a.status !== AppointmentStatusEnum.CONFIRMED
        );
        setHasAppointment((hasAppt && hasAppt.length > 0) || false);
        setAllAppointments(hasAppt || []);

        if (list && list.length > 0) {
          setView("list");
        } else {
          setView("new_choice");
        }
      } catch (error) {
        notification.error({ message: "Failed to load chat data:", description: (error as Error).message });
        setView("new_choice");
      }
    })();
  }, []);

  const handleOpenStaffModal = () => {
    setSelectedAppointmentId(0);
    setModalOpen(true);
  };

  const handleStartStaffConsult = async () => {
    if (selectedAppointmentId === 0) {
      notification.error({ message: "Error", description: "Please select an appointment to consult." });
      return;
    }

    setIsLoading(true);
    try {
      const { conversationId } = await startConsultation(selectedAppointmentId);
      const newList = await listConversations();
      setConversations(newList);
      setModalOpen(false);
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
      setSelectedId(response.data ?? "");
      setView("chat");
    } catch (error) {
      notification.error({
        message: "Error",
        description: (error as Error).message || "Failed to start consultation",
      });
    }
  };

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

  const LoadingState = () => (
    <div
      className="chat-loading"
      style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Spin size="large" />
    </div>
  );

  const WelcomeAndChoiceState = () => (
    <div className="chat-welcome-state">
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
      <h3 className="chat-welcome-title">Welcome to EVCare</h3>
      <p className="chat-welcome-description">Need help? Please select a consultation type:</p>
      <div className="chat-choice-buttons">
        <Button icon={<RobotOutlined />} size="large" className="btn-choice-ai" onClick={handleStartAIChat}>
          Chat with AI
        </Button>
        <Tooltip
          title={
            !hasAppointment
              ? "You need to have at least 1 appointment (other status than pending, confirmed or cancel) to be able to contact the staff in charge of that appointment."
              : ""
          }
        >
          <Button
            icon={<UserSwitchOutlined />}
            size="large"
            type="primary"
            className="btn-choice-staff"
            onClick={() => handleOpenStaffModal()}
            disabled={!hasAppointment}
          >
            Meet with a consultant
          </Button>
        </Tooltip>
      </div>
    </div>
  );

  const ConversationListState = () => (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="chat-sidebar-header">
        <h2 className="chat-sidebar-title">
          <MessageOutlined />
          <span>Messages</span>
        </h2>
        {role === RoleEnum.CUSTOMER && (
          <Tooltip title="New Consultation">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleGoToNewChoice}
              className="btn-new-chat-widget"
              shape={isWidgetMode ? "circle" : "default"}
              size={isWidgetMode ? "middle" : "large"}
            >
              {!isWidgetMode && "New Consultation"}
            </Button>
          </Tooltip>
        )}
      </div>
      <div style={{ flex: 1, overflowY: "auto", borderTop: "1px solid #f0f0f0" }}>
        <ChatSidebar
          accountId={accountId?.toString() ?? ""}
          conversations={conversations}
          selectedId={selectedId}
          onSelect={handleSelectConversation}
        />
      </div>
    </div>
  );

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
            onBack={handleBackToList}
            isWidgetMode={isWidgetMode}
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

      <Modal
        className="consultation-modal"
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.125rem", fontWeight: 600 }}>
            <UserSwitchOutlined style={{ color: "#00ad4e" }} />
            <span>Start Consultation (Staff)</span>
          </div>
        }
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
        }}
        onOk={handleStartStaffConsult}
        okText="Start"
        cancelText="Cancel"
        okButtonProps={{
          className: "btn-send-message",
          size: "large",
          loading: isLoading,
          disabled: selectedAppointmentId === 0,
        }}
        cancelButtonProps={{ size: "large" }}
      >
        <Spin spinning={isLoading}>
          <div style={{ padding: "1.5rem 0 0.5rem" }}>
            <Alert
              message="Staff Chat Policy"
              description={
                <Space direction="vertical" size={0}>
                  <Text>
                    - We only support direct chat with staff for appointments that are in progress or completed.
                  </Text>
                  <Text>- Appointments that are pending, canceled, or confirmed will be handled by AI.</Text>
                </Space>
              }
              type="info"
              showIcon
              style={{ marginBottom: "1.5rem" }}
            />

            <label className="consultation-modal-label" style={{ marginBottom: "1rem" }}>
              Please select an appointment to get started:
            </label>

            {allAppointments.length > 0 ? (
              <Radio.Group
                onChange={(e) => setSelectedAppointmentId(e.target.value)}
                value={selectedAppointmentId}
                style={{ width: "100%" }}
              >
                <List
                  bordered
                  dataSource={allAppointments}
                  renderItem={(appt: any) => (
                    <List.Item>
                      <Radio value={appt.id}>
                        <Text>#{appt.code || `ID: ...${appt.id.slice(-6)}`}</Text>
                        <Text type="secondary" style={{ marginLeft: "10px" }}>
                          (Status: {appt.status})
                        </Text>
                      </Radio>
                    </List.Item>
                  )}
                />
              </Radio.Group>
            ) : (
              <Text type="secondary">You don't have any valid appointments to start a chat with.</Text>
            )}
          </div>
        </Spin>
      </Modal>
    </WidgetChatStyleWrapper>
  );
};
