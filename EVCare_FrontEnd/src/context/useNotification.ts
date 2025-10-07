import { useContext } from "react";
import { NotificationContext } from "./NotificationContext";
import type { NotificationInstance } from "antd/es/notification/interface";

export const useNotification = (): NotificationInstance => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
