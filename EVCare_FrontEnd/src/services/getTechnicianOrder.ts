import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import type {
  ResponseDto,
  TechnicianAddedPart,
} from "../models/OrderPartModel/OrderTechnicianAdded";

const fetchTechnicianAddedParts = async (orderId: number) => {
  const response = await api.get<ResponseDto<TechnicianAddedPart[]>>(
    "/api/Order/technician-orders",
    {
      params: { orderId },
    }
  );
  return response.data;
};

export const getTechnicianAddedParts = (orderId: number) => {
  return useQuery({
    queryKey: ["TechnicianAddedParts", orderId],
    queryFn: () => fetchTechnicianAddedParts(orderId),
    enabled: !!orderId,
  });
};
