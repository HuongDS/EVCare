import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { getChatConnection } from "../signalr/chatConnection";
import type Message from "../models/Message/Message";
import type Attachment from "../models/Message/Attachment ";

export function useChat(conversationId?: string) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unread, setUnread] = useState<number>(0);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    const conn = getChatConnection();
    connectionRef.current = conn;

    conn.off("ReceiveMessage");
    conn.off("ReceiveMessageAck");
    conn.off("UnreadChanged");
    conn.off("Typing");
    conn.off("StopTyping");

    conn.on("ReceiveMessage", (m) => setMessages((prev) => [...prev, m]));
    conn.on("ReceiveMessageAck", (m) => setMessages((prev) => [...prev, m]));
    conn.on("UnreadChanged", ({ conversationId: cid, unread }) => {
      if (cid === conversationId) setUnread(unread);
    });
    conn.on("Typing", ({ userId }) => setTypingUsers((s) => Array.from(new Set([...s, userId]))));
    conn.on("StopTyping", ({ userId }) => setTypingUsers((s) => s.filter((x) => x !== userId)));

    if (conn.state === "Disconnected") {
      conn.start().catch((err) => console.error("SignalR start error:", err));
    }

    return () => {
      conn.off("ReceiveMessage");
      conn.off("ReceiveMessageAck");
      conn.off("UnreadChanged");
      conn.off("Typing");
      conn.off("StopTyping");
    };
  }, []);

  useEffect(() => {
    const conn = connectionRef.current;
    if (!conn || conn.state !== "Connected") return;
    conn.invoke("JoinConversation", conversationId).catch((err) => console.error("JoinConversation failed:", err));
  }, [conversationId]);

  const send = async (text: string, attachments?: Attachment[]) =>
    connectionRef.current?.invoke("SendMessage", conversationId, text, attachments ?? null);

  const markRead = async (upToMessageId: number) =>
    connectionRef.current?.invoke("MarkAsRead", conversationId, upToMessageId);

  const startTyping = async () => connectionRef.current?.invoke("StartTyping", conversationId);
  const stopTyping = async () => connectionRef.current?.invoke("StopTyping", conversationId);

  return { messages, setMessages, unread, typingUsers, send, markRead, startTyping, stopTyping };
}
