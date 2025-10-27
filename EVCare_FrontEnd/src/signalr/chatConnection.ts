import * as signalR from "@microsoft/signalr";
import { getAccessToken } from "../token/tokenStore";

let connection: signalR.HubConnection | null = null;

export function getChatConnection() {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE}/hubs/chat`, {
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: true,
        accessTokenFactory: () => getAccessToken() || "",
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }
  return connection;
}

export async function stopChatConnection() {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    await connection.stop();
  }
}
