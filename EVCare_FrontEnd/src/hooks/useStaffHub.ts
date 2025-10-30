import { useEffect, useRef } from "react";
import { getStaffDashboardConnection } from "../signalr/staffConnection";
import * as signalR from "@microsoft/signalr";

type DashboardPayload<T> = {
  type: string;
  data: T;
};

export function useStaffDashboardHub<T>(
  onUpdate: (type: string, data: T) => void
) {
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    const conn = getStaffDashboardConnection(import.meta.env.VITE_API_BASE);
    const handler = (payload: DashboardPayload<T>) => {
      onUpdateRef.current(payload.type, payload.data);
    };
    conn.on("StaffDashboardUpdate", handler);
    if (conn.state === signalR.HubConnectionState.Disconnected) {
      conn
        .start()
        .then(() => console.log("Staff hub connected!"))
        .catch((err) => console.log("Staff hub connected failed: ", err));
    }
    return () => {
      console.log("Cleaning staff hub");
      conn.off("StaffDashboardUpdate", handler);
    };
  }, []);
}
