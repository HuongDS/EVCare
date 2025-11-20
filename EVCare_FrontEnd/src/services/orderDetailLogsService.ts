import { isAxiosError } from "axios";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import { api } from "../api/api";
import type { ResponseDto } from "../models/AuthModel/authModel";
import type { OrderDetailLogs } from "../models/OrderModel/OrderDetailLogs";

export async function getOrderDetailLogs(params: { orderId: number }) {
  try {
    const response = await api.get<ResponseDto<OrderDetailLogs>>("/api/OrderDetailLog", {
      params: params,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errMsg = error.message || error.response?.data.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}
