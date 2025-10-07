import type { NotificationInstance } from "antd/es/notification/interface";
import { createContext } from "react";

export const NotificationContext = createContext<NotificationInstance | null>(null);
