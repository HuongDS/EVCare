import { useEffect, useRef } from "react";
import { getTechnicianConnection } from "../signalr/technicianConnection";
import * as signalR from "@microsoft/signalr";

type TechnicianHub<T> = {
  type: string;
  data: T;
};

export function useTechnicianHubNewJob<T>(
  onUpdate: (type: string, data: T) => void
) {
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    const conn = getTechnicianConnection(import.meta.env.VITE_API_BASE);
    const handler = (payload: TechnicianHub<T>) => {
      onUpdateRef.current(payload.type, payload.data);
    };

    conn.on("TechnicianNewJob", handler);

    if (conn.state === signalR.HubConnectionState.Disconnected) {
      conn
        .start()
        .then(() => console.log("TechHub connected !"))
        .catch((err) => console.log("Techhub connected failed: ", err));
    }
    return () => {
      conn.off("TechnicianNewJob", handler);
    };
  }, []);
}
