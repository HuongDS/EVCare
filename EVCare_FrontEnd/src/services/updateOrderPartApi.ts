import { useMutation } from "@tanstack/react-query";
import { api } from "../api/api";
import type { ResponseDto } from "../models/OrderPartModel/Order_Parts_Model";
import type { UpdateOrderPartDto } from "../models/OrderPartModel/Order_Parts_Model";
import { handleError } from "../utils/errorHandler";
import axios from "axios";
import { ERROR_MESSAGE } from "../constants/messages/Message";

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
        if (axios.isAxiosError(error)) {
          const errMsg = error.response?.data.message || error.message;
          throw new Error(errMsg);
        }
        throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      }
    },
  });
};

export const useAddPartToOrder = () => {
  return useMutation({
    mutationKey: ["AddPartToOrder"],
    mutationFn: async (payload: UpdateOrderPartDto) => {
      try {
        const response = await api.post<ResponseDto<number>>(
          "/api/Order/parts",
          payload
        );
        return response.data;
      } catch (error) {
        handleError(error);
        if (axios.isAxiosError(error)) {
          const errMsg = error.response?.data.message || error.message;
          throw new Error(errMsg);
        }
        throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      }
    },
  });
};
