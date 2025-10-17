import { api } from "../api/api";
import type { Conversation } from "../models/Message/Conversation";
import type { HistoryMessage } from "../models/Message/HistoryMessage";

export async function listConversations() {
  const response = await api.get<Conversation[]>("/api/chat/conversations");
  return response.data;
}

export async function getHistory(conversationId: number, skip = 0, take = 30) {
  const response = await api.get<HistoryMessage[]>(`/api/chat/history/${conversationId}`, {
    params: {
      skip: skip,
      take: take,
    },
  });
  return response.data;
}

export async function startConsultation() {
  const response = await api.post<{ conversationId: number; assignedTo: number }>("/api/chat/consultations");
  return response.data;
}
