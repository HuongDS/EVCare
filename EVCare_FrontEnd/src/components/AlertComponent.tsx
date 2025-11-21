import React from "react";
import { Alert } from "antd";
import type { NotificationType } from "../models/Notification/NotificationType";

interface props {
  message: string;
  type: NotificationType;
}

const App: React.FC<props> = ({ message, type }: props) => <Alert message={message} type={type} showIcon closable />;

const AlertComponent = React.memo(App);
export default AlertComponent;
