import React, { useEffect } from "react";
import { notification } from "antd";
import type { NotificationType } from "../models/Notification/NotificationType";

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
      showProgress: true,
      pauseOnHover: true,
    });
  }, [api, msg, title, type]);

  return <>{contextHolder}</>;
};

const NotificationComponent = React.memo(Notification);
export default NotificationComponent;
