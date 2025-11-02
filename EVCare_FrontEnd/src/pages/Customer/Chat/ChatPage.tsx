import { useCallback, useEffect, useState } from "react";
import { Button, Modal, Spin, Tooltip } from "antd";
import { MessageOutlined, PlusOutlined, RobotOutlined, UserSwitchOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import type { Conversation } from "../../../models/Message/Conversation";
import { listConversations, startConsultation, startChatWithAi } from "../../../services/chatService";
import { ChatSidebar } from "./ChatSideBar";
import { ChatWindow } from "./ChatWindow";
import type { RootState } from "../../../states/store";
import { useSelector } from "react-redux";
import { AppointmentStatusEnum, EmployeeStatusEnum, RoleEnum } from "../../../models/enums";
import { WidgetChatStyleWrapper } from "./WidgetChat.styled";
import { useNotification } from "../../../context/useNotification";
import { getCustomerAppointment } from "../../../services/appointmentServiceApi";
import type { AppointmentViewDetailModel } from "../../../models/AppointmentsModel/AppointmentViewDetailModel";
import { formatDate } from "../../../utils/formatDate";
import type { HistoryMessage } from "../../../models/Message/HistoryMessage";
import { getEmployeeById } from "../../../services/adminService";
import { checkStaffAvailable } from "../../../services/staffService";

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
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [isStaffAvailable, setIsStaffAvailable] = useState(true);

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
      const conversation = newList.find((conv) => conv.id === conversationId);
      // use employeeId to check available or not
      const staff = await getEmployeeById(Number(conversation?.participants[1]?.employeeId) || 0);
      // then update UI
      const checkAvailableStaff = await checkStaffAvailable(staff.data?.employeeId || 0);
      setIsStaffAvailable(checkAvailableStaff.data?.statusEnum === EmployeeStatusEnum.Available);
      setConversations(newList);
      setModalOpen(false);
      setSelectedId(conversationId);
      setSelectedConv(conversation || null);
      setView("chat");
    } catch (error) {
      notification.error({
        message: "Error",
        description: (error as Error).message || "Failed to start consultation",
      });
    }
    setIsLoading(false);
  };

  const handleStartAIChat = async () => {
    try {
      const response = await startChatWithAi();
      const newList = await listConversations();
      setConversations(newList);
      setModalOpen(false);
      setSelectedId(response.data ?? "");
      setSelectedConv(newList.find((conv) => conv.id === response.data) || null);
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
            setLastMessage={handleNewMessage}
            selectedConversation={selectedConv}
            isStaffAvailable={isStaffAvailable}
          />
        );
      default:
        return <WelcomeAndChoiceState />;
    }
  };

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
        <WidgetChatStyleWrapper>
          <Spin spinning={isLoading}>
            <div className="custom-modal-body">
              <div className="custom-modal-alert">
                <span className="alert-icon">i</span>
                <div className="alert-content">
                  <p className="alert-title">Staff Chat Policy</p>
                  <ul className="alert-list">
                    <li>We only support direct chat with staff for appointments that are in progress or completed.</li>
                    <li>Other appointments (Pending, Canceled...) will be advised by AI.</li>
                  </ul>
                </div>
              </div>

              <label className="custom-modal-label">Please select an appointment to start:</label>

              {allAppointments.length > 0 ? (
                <div className="custom-radio-list">
                  {allAppointments.map((appt: AppointmentViewDetailModel) => (
                    <div
                      key={appt.id}
                      className={`custom-radio-item ${selectedAppointmentId === appt.id ? "selected" : ""}`}
                      onClick={() => setSelectedAppointmentId(appt.id)}
                    >
                      <div className="radio-icon">
                        <div className="radio-dot"></div>
                      </div>
                      <div className="radio-content">
                        <span className="radio-title">{`Appointment #${appt.id} | Time & Date: ${formatDate(
                          appt.appointmentDate.toString()
                        )}`}</span>
                        <span className="radio-status">(Status: {appt.status})</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="custom-empty-text">You don't have any valid appointments to start a chat with.</p>
              )}
            </div>
          </Spin>
        </WidgetChatStyleWrapper>
      </Modal>
    </WidgetChatStyleWrapper>
  );
};
