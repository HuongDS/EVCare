import { createContext } from "react";
import type { NotificationType } from "../models/Notification/NotificationType";

export interface AlertContextType {
  showAlert: (type: NotificationType, message: string, description: string) => void;
}

export const AlertContext = createContext<AlertContextType | null>(null);
