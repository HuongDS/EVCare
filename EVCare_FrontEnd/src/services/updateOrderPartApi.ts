// src/services/updateOrderPartApi.ts
import { useMutation } from "@tanstack/react-query";
import { api } from "../api/api";
import type { ResponseDto } from "../models/OrderPartModel/Order_Parts_Model";
import type { UpdateOrderPartDto } from "../models/OrderPartModel/Order_Parts_Model";
import { handleError } from "../utils/errorHandler";

// Hàm gọi API PUT
export async function updateOrderParts(payload: UpdateOrderPartDto) {
  try {
    const response = await api.put<ResponseDto<number>>(
      "/api/Order/parts",
      payload
    );
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export const useUpdateOrderParts = () => {
  return useMutation({
    mutationKey: ["UpdateOrderParts"],
    mutationFn: async (payload: UpdateOrderPartDto) => {
      try {
        const response = await api.put<ResponseDto<number>>(
          "/api/Order/parts",
          payload
        );
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
  });
};
