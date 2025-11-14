import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import type {
  OrderModel,
  CreateOrderParams,
  ResponseDto,
} from "../models/OrderModel/CreateOrderModel";
import type {
  PartsDetailDto,
  ViewOrderDataDto,
  ViewOrderResponeDto,
} from "../models/OrderModel/ViewOrderModel";
import type {
  OrderPartDto,
  UpdateOrderRequest,
  UpdateOrderResponse,
  UpdateOrderStatusPrams,
} from "../models/OrderModel/UpdateOrderModel";
import { handleError } from "../utils/errorHandler";
import axios from "axios";
import { ERROR_MESSAGE } from "../constants/messages/Message";

export const useCreateNewOrder = () => {
  return useMutation({
    mutationFn: async (params: CreateOrderParams) => {
      const response = await api.post<ResponseDto<OrderModel>>(
        "/api/Order/create-order",
        params
      );
      return response.data;
    },
  });
};

export const useGetOrderDetail = (orderId: number) => {
  return useQuery({
    queryKey: ["OrderDetail", orderId],
    queryFn: async () => {
      const response = await api.get<
        ViewOrderResponeDto<ViewOrderDataDto<PartsDetailDto>>
      >("/api/Order/get-order-detail/" + `${orderId}`);
      return response.data;
    },
    enabled: !!orderId,
  });
};

export const useStaffUpdateOrder = () => {
  return useMutation({
    mutationFn: async (params: UpdateOrderRequest<OrderPartDto>) => {
      try {
        const response = await api.put<
          ResponseDto<UpdateOrderRequest<OrderPartDto>>
        >("/api/Order", params);
        return response.data;
      } catch (error) {
        handleError(error);
        if (axios.isAxiosError(error)) {
          const errMsg =
            error.response?.data.message ||
            error.message ||
            ERROR_MESSAGE.FETCH_DATA_FAILED;
          throw new Error(errMsg);
        }
        throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      }
    },
  });
};

export const useUpdateOrderStatus = () => {
  return useMutation({
    mutationFn: async (params: UpdateOrderStatusPrams) => {
      try {
        const response = await api.post<ResponseDto<UpdateOrderResponse>>(
          "/api/Order/update-order-status",
          params
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errMsg =
            error.response?.data.message ||
            error.message ||
            ERROR_MESSAGE.FETCH_DATA_FAILED;
          throw new Error(errMsg);
        }
        throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      }
    },
  });
};
