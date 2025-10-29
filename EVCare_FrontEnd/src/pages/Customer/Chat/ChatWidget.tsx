import { useState } from "react";
import { Button } from "antd";
import { MessageOutlined, CloseOutlined } from "@ant-design/icons";
import { ChatPage } from "./ChatPage";
import { WidgetChatStyleWrapper } from "./WidgetChat.styled";

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <WidgetChatStyleWrapper>
      <Button
        className="chat-widget-trigger"
        type="primary"
        shape="circle"
        icon={isOpen ? <CloseOutlined /> : <MessageOutlined />}
        onClick={toggleChat}
      />

      {isOpen && (
        <div className="chat-widget-container">
          <ChatPage isWidgetMode={true} />
        </div>
      )}
    </WidgetChatStyleWrapper>
  );
};
