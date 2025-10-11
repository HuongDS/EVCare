import { useEffect } from "react";
import type { DashboardUpdateDto } from "../models/Dashboard/dashBoardUpdateDto";
import { getAdminDashboardConnection } from "../signalr/adminConnection";
// import { getAccessToken } from "../token/tokenStore";
import * as signalR from "@microsoft/signalr";

export function useDashboardHub(onUpdate: (data: DashboardUpdateDto) => void) {
  useEffect(() => {
    const conn = getAdminDashboardConnection(import.meta.env.VITE_API_BASE);
    const handler = (payload: DashboardUpdateDto) => onUpdate(payload);
    conn.on("AdminDashboardUpdate", handler);
    if (conn.state === signalR.HubConnectionState.Disconnected) {
      conn
        .start()
        .then(() => console.log("[Hub] Connected"))
        .catch((err) => console.error("[Hub] Start failed", err));
    }
    return () => {
      conn.off("AdminDashboardUpdate", handler);
    };
  }, [onUpdate]);
}
