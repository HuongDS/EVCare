import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { getChatConnection } from "../signalr/chatConnection";
import type Message from "../models/Message/Message";
import type Attachment from "../models/Message/Attachment ";

export function useChat(conversationId?: string) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unread, setUnread] = useState<number>(0);

  useEffect(() => {
    const conn = getChatConnection();
    connectionRef.current = conn;

    conn.off("ReceiveMessage");
    conn.off("ReceiveMessageAck");
    conn.off("UnreadChanged");

    conn.on("ReceiveMessage", (m) => setMessages((prev) => [...prev, m]));
    conn.on("ReceiveMessageAck", (m) => setMessages((prev) => [...prev, m]));
    conn.on("UnreadChanged", ({ conversationId: cid, unread }) => {
      if (cid === conversationId) setUnread(unread);
    });

    if (conn.state === "Disconnected") {
      conn.start().catch((err) => console.error("SignalR start error:", err));
    }

    return () => {
      conn.off("ReceiveMessage");
      conn.off("ReceiveMessageAck");
      conn.off("UnreadChanged");
    };
  }, []);

  useEffect(() => {
    const conn = connectionRef.current;
    if (!conn || conn.state !== "Connected") return;
    conn.invoke("JoinConversation", conversationId).catch((err) => console.error("JoinConversation failed:", err));
  }, [conversationId]);

  const send = async (text: string, attachments?: Attachment[]) =>
    connectionRef.current?.invoke("SendMessage", conversationId, text, attachments ?? null);

  // const markRead = async (upToMessageId: number) =>
  //   connectionRef.current?.invoke("MarkAsRead", conversationId, upToMessageId);

  return { messages, setMessages, unread, send };
}
