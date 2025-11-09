// src/services/getTechnicianOrder.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import type {
  ResponseDto,
  TechnicianAddedPart,
} from "../models/OrderPartModel/OrderTechnicianAdded";
import { requestQueue } from "./requestQueue";

export const fetchTechnicianAddedParts = async (
  orderId: number
): Promise<TechnicianAddedPart[]> => {
  return requestQueue.enqueue(async () => {
    const response = await api.get<ResponseDto<TechnicianAddedPart[]>>(
      "/api/Order/technician-orders",
      { params: { orderId } }
    );
    return response.data.data ?? [];
  });
};

export const getTechnicianAddedParts = (orderId?: number) => {
  return useQuery({
    queryKey: ["TechnicianAddedParts", orderId],
    queryFn: () => fetchTechnicianAddedParts(orderId!),
    enabled: !!orderId,
    staleTime: 1000 * 60,
  });
};
