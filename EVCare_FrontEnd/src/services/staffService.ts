import { useQuery } from "@tanstack/react-query";
import type { GetCustomerListParams } from "../models/CustomerModels/CustomerViewDto";
import { api } from "../api/api";
import type { ResponseDto } from "../models/AuthModel/authModel";
import type { PageResultDto } from "../models/PageResult/PageResultDto";
import type { FullCustomerInfor } from "../models/CustomerModels/FullCustomerInfor";
import { handleError } from "../utils/errorHandler";
import type { CategoryResponseDTO } from "../models/OrderPartModel/Category_Model";
import type {
  GetPartParams,
  PartDetailDto,
} from "../models/PartModel/PartModel";

interface GetPartCategoryParams {
  pageSize?: number;
  pageIndex?: number;
}

export const useGetAllCustomer = (params: GetCustomerListParams) => {
  return useQuery({
    queryKey: ["ListCustomers", params],
    queryFn: async () => {
      try {
        const response = await api.get<
          ResponseDto<PageResultDto<FullCustomerInfor>>
        >("/api/Customer", { params });
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
  });
};

export const useGetAllPartCategories = (params: GetPartCategoryParams) => {
  return useQuery({
    queryKey: ["PartCategories", params],
    queryFn: async () => {
      try {
        const response = await api.get<
          ResponseDto<PageResultDto<CategoryResponseDTO>>
        >("/api/PartCategory", { params });
        return response.data;
      } catch (error) {
        handleError(error);
      }
    },
  });
};

export const useGetParts = (params: GetPartParams) => {
  return useQuery({
    queryKey: ["PartList", params],
    queryFn: async () => {
      try {
        const response = await api.get<
          ResponseDto<PageResultDto<PartDetailDto>>
        >("/api/Part", { params });
        return response.data;
      } catch (error) {
        handleError(error);
      }
    },
  });
};
