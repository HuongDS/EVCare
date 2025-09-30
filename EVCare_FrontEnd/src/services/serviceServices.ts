import { api } from "../api/api";
import type { ResponseDto } from "../models/AuthModel/authModel";
import type { ServiceCategoryViewModel } from "../models/ServicesModel/ServiceCategoryViewModel";
import { handleError } from "../utils/errorHandler";

export async function getAllServices() {
  try {
    const response = await api.get<ResponseDto<ServiceCategoryViewModel[]>>("/api/ServiceCategory");
    return response.data;
  } catch (error) {
    handleError(error);
  }
}
