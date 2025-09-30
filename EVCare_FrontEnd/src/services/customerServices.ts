import { api } from "../api/api";
import type { ResponseDto } from "../models/AuthModel/authModel";
import type { CustomerViewDto } from "../models/CustomerModels/CustomerViewDto";
import { handleError } from "../utils/errorHandler";

export async function getCustomerId(accountId: number) {
  try {
    const response = await api.get<ResponseDto<CustomerViewDto>>(`/api/Customer/${accountId}`);
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}
