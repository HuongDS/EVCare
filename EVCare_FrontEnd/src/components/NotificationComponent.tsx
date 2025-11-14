import React, { useEffect } from "react";
import { notification } from "antd";
import type { NotificationType } from "../models/Notification/NotificationType";
import styled from "styled-components";

interface props {
  type: NotificationType;
  title: string;
  msg: string;
}

const Notification: React.FC<props> = ({ type, title, msg }: props) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    api[type]({
      message: title,
      description: msg,
      className: "custom-noti",
      showProgress: true,
      pauseOnHover: true,
    });
  }, [api, msg, title, type]);

  return <StyledNotification>{contextHolder}</StyledNotification>;
};

const NotificationComponent = React.memo(Notification);
export default NotificationComponent;

const StyledNotification = styled.div`
  .ant-notification-notice-message {
    font-family: "Outfit", sans-serif;
    font-size: 18px;
    font-weight: bold;
  }
  .ant-notification-notice-description {
    font-family: "Outfit", sans-serif;
    font-size: 15px;
  }
`;
