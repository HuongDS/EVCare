import { Alert } from "antd";
import { AlertContext } from "./AlertContext";
import type React from "react";
import { useState, type ReactNode } from "react";
import type { NotificationType } from "../models/Notification/NotificationType";

interface AlertInfo {
  type: NotificationType;
  message: string;
  description: string;
}

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<AlertInfo | null>(null);

  const showAlert = (type: NotificationType, message: string, description: string) => {
    setAlert({ type, message, description });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          description={alert.description}
          showIcon
          closable
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            width: 300,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          }}
        />
      )}
      {children}
    </AlertContext.Provider>
  );
};
