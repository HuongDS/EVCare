import { api } from "../api/api";
import type {
  OrderModel,
  OrderParams,
  ResponseDto,
} from "../models/OrderModel/CreateOrderModel";

export const CreateNewOrder = async (params: OrderParams) => {
  const response = await api.post<ResponseDto<OrderModel>>(
    "/api/Order/create-order",
    params
  );
  console.log("order idd:" + response.data.data?.orderID);
  return response.data;
};
