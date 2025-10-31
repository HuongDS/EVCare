import axios from "axios";
import { api } from "../api/api";
import type { Conversation } from "../models/Message/Conversation";
import type { HistoryMessage } from "../models/Message/HistoryMessage";
import type { ResponseDto } from "../models/AuthModel/authModel";

export async function listConversations() {
  const response = await api.get<Conversation[]>("/api/Chat/conversations");
  return response.data;
}

export async function getHistory(conversationId: string, skip = 0, take = 30) {
  const response = await api.get<HistoryMessage[]>(`/api/Chat/history/${conversationId}`, {
    params: {
      skip: skip,
      take: take,
    },
  });
  return response.data;
}

export async function startConsultation(appointmentId: number) {
  try {
    const response = await api.post<{ conversationId: string; assignedTo: string }>(
      "/api/Chat/consultations",
      appointmentId
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to start consultation");
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function startChatWithAi() {
  try {
    const response = await api.post<ResponseDto<string>>("/api/Chat/conversations/domain/AI");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to start consultation");
    }
    throw new Error("An unexpected error occurred");
  }
}
