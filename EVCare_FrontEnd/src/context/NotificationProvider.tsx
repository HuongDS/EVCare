import { notification } from "antd";
import { NotificationContext } from "./NotificationContext";

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();
  return (
    <NotificationContext.Provider value={api}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};
