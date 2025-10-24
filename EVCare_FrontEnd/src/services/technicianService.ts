import axios from "axios";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import { api } from "../api/api";
import type { ResponseDto } from "../models/AuthModel/authModel";
import type { TechnicianCusViewModel } from "../models/Techinician/TechnicianCusViewModel";

export async function getTechniciansByOrderId(data: number) {
  try {
    const response = await api.get<ResponseDto<TechnicianCusViewModel[]>>(`/technicians-by-orderId/${data}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message || ERROR_MESSAGE.FAILED_TO_GET_TECHNICIANS;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.FAILED_TO_GET_TECHNICIANS);
  }
}
