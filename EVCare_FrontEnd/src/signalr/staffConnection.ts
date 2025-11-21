import * as signalR from "@microsoft/signalr";
import { getAccessToken } from "../token/tokenStore";

let connection: signalR.HubConnection | null = null;

export function getStaffDashboardConnection(baseUrl: string) {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/hubs/staffDashboard`, {
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

export async function stopStaffDashboardConnection() {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    await connection.stop();
  }
}
