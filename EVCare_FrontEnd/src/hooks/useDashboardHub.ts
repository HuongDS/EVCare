import { useEffect, useRef } from "react";
import type { DashboardUpdateDto } from "../models/Dashboard/dashBoardUpdateDto";
import * as signalR from "@microsoft/signalr";
import { getAccessToken } from "../token/tokenStore";

export function useDashboardHub(onUpdate: (data: DashboardUpdateDto) => void) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  useEffect(() => {
    let conn: signalR.HubConnection | null = null;
    const connect = async () => {
      conn = new signalR.HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_API_BASE_URL}/hubs/adminDashboard`, {
          withCredentials: true,
          accessTokenFactory: () => getAccessToken() || "",
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      try {
        await conn.start();
        console.log("Connected to Admin Dashboard Hub");

        conn.on("AdminDashboardUpdate", (payload: DashboardUpdateDto) => {
          onUpdate(payload);
        });

        connectionRef.current = conn;
      } catch (err) {
        console.error("Failed to connect SignalR:", err);
      }
    };

    connect();

    return () => {
      if (conn) conn.stop().catch(() => {});
    };
  }, [onUpdate]);
}
