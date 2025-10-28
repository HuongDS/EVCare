import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import type { ResponseDto } from "../models/AuthModel/authModel";
import type { ServiceCategoryViewModel } from "../models/ServicesModel/ServiceCategoryViewModel";
import { handleError } from "../utils/errorHandler";
import type { ServiceCreateDto } from "../models/ServicesModel/ServiceCreateDto";
import axios from "axios";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import type { Service } from "../models/ServicesModel/ServiceViewModel";
import type { PageResultDto } from "../models/PageResult/PageResultDto";
import type { ServiceCategoryAdminDto } from "../models/ServicesModel/ServiceCategoryAdminDto";

/**
 * [CUSTOMER, STAFF, ADMIN] get all service category
 * @returns
 * author: SONG HUONG
 */
export async function getAllServices() {
  try {
    const response = await api.get<ResponseDto<ServiceCategoryViewModel[]>>("/api/ServiceCategory");
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export const useGetAllCategory = () => {
  return useQuery({
    queryKey: ["ServiceCategoryName"],
    queryFn: getAllServices,
  });
};

export async function createService(data: ServiceCreateDto) {
  try {
    const response = await api.post<ResponseDto<number>>("/api/Service", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.FAILED_WHEN_CREATE_SERVICE);
  }
}

export async function deleteService(params: { serviceId: number }) {
  try {
    const response = await api.delete("/api/Service", {
      params: params,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.FAILED_WHEN_DELETE_SERVICE);
  }
}

export async function updateService(data: Service) {
  try {
    const response = await api.put("/api/Service", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.FAILED_WHEN_UPDATE_SERVICE);
  }
}

export async function getAllServicesWithPagination(params: {
  keyword?: string;
  pageSize?: number;
  pageIndex?: number;
}) {
  try {
    const response = await api.get<ResponseDto<PageResultDto<Service>>>("/api/Service", {
      params: params,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getAllServiceCategories() {
  try {
    const response = await api.get<ResponseDto<PageResultDto<ServiceCategoryAdminDto>>>("/api/ServiceCategory/admin");
    return response.data;
  } catch (error) {
    handleError(error);
  }
}
