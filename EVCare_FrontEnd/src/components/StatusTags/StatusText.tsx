export type StatusText =
  | "Pending"
  | "Processing"
  | "Paused"
  | "Completed"
  | "WaitingForPayment"
  | "Cancelled"
  | "Confirmed"
  | "CheckedIn"
  | "InProgress"
  | "Done"
  | "Available"
  | "Busy"
  | "OnLeave"
  | "Failed"
  | "Refund"
  | "InStock"
  | "LowStock"
  | "OutOfStock";

export const StatusColors: Record<StatusText, string> = {
  Pending: "#f59e0b",
  Processing: "#3b82f6",
  Paused: "#6b7280",
  Completed: "#10b981",
  WaitingForPayment: "#f97316",
  Cancelled: "#ef4444",
  Confirmed: "#2563eb",
  CheckedIn: "#0ea5e9",
  InProgress: "#3b82f6",
  Done: "#22c55e",
  Available: "#16a34a",
  Busy: "#eab308",
  OnLeave: "#a855f7",
  Failed: "#dc2626",
  Refund: "#14b8a6",
  InStock: "#22c55e",
  LowStock: "#f59e0b",
  OutOfStock: "#ef4444",
};
