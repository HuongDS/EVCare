import { api } from "../api/api";
import type {
  ResponseDto,
  CreateOrderRequest,
} from "../models/OrderPartModel/Create_Order_Model";
import { handleError } from "../utils/errorHandler";

export async function createOrder(request: CreateOrderRequest) {
  try {
    const response = await api.post<ResponseDto<CreateOrderRequest>>(
      "/api/Order/create-order",
      request
    );

    return response.data;
  } catch (error) {
    handleError(error);
    return {
      statusCode: 500,
      message: "Failed to create order",
      data: null,
    } as ResponseDto<null>;
  }
}
