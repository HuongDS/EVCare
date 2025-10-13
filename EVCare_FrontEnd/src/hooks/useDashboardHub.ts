import { useEffect, useRef } from "react";
// import type { DashboardUpdateDto } from "../models/Dashboard/dashBoardUpdateDto";
import { getAdminDashboardConnection } from "../signalr/adminConnection";
// import { getAccessToken } from "../token/tokenStore";
import * as signalR from "@microsoft/signalr";

type DashboardPayload<T> = {
  type: string;
  data: T;
};

export function useDashboardHub<T>(onUpdate: (type: string, data: T) => void) {
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    const conn = getAdminDashboardConnection(import.meta.env.VITE_API_BASE);
    const handler = (payload: DashboardPayload<T>) => {
      onUpdateRef.current(payload.type, payload.data);
    };
    conn.on("AdminDashboardUpdate", handler);
    if (conn.state === signalR.HubConnectionState.Disconnected) {
      conn
        .start()
        .then(() => console.log("[Hub] Connected"))
        .catch((err) => console.error("[Hub] Start failed", err));
    }
    return () => {
      console.log("[Hub] Cleaning up connection...");
      conn.off("AdminDashboardUpdate", handler);
    };
  }, []);
}
