import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

export function getAdminDashboardConnection(baseUrl: string) {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/hubs/adminDashboard`, {
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }
  return connection;
}
