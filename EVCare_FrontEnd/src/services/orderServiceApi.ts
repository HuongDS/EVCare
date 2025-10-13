import { useQuery } from "@tanstack/react-query";
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

/**
 * Tạo 1 order mới khi staff check in cho khách hàng
 * @param params
 * @returns
 */
export const CreateNewOrder = async (params: CreateOrderParams) => {
  const response = await api.post<ResponseDto<OrderModel>>(
    "/api/Order/create-order",
    params
  );
  return response.data;
};

/**
 * Lấy order detail
 * @param orderId
 * @returns
 */
export const useGetOrderDetail = (orderId: number) => {
  return useQuery({
    queryKey: ["OrderDetail", orderId],
    queryFn: async () => {
      const response = await api.get<
        ViewOrderResponeDto<ViewOrderDataDto<PartsDetailDto>>
      >("/api/Order/get-order-detail/" + `${orderId}`);
      return response.data;
    },
  });
};
