import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import type {
  ResponseDto,
  ServicePageModel,
  ServicesResponseDto,
} from "../models/ServicesModel/Customer_Services_Model";
import type { GetServiceParams } from "../models/ServicesModel/ServiceViewModel";
import { handleError } from "../utils/errorHandler";
import axios from "axios";
import { ERROR_MESSAGE } from "../constants/messages/Message";

/**
 * [STAFF, CUSTOMER, ADMIN] - get all services
 * @param keyword : customer name
 * @param pageSize : so luong mỗi trang
 * @param pageIndex : trang hiện tại
 * @param sortField : sort theo field
 * @param sortOrder : asc descs
 * @returns
 */
const fetchServiceData = async (
  keyword?: string,
  pageSize?: number,
  pageIndex?: number,
  sortField?: string,
  sortOrder?: string
) => {
  const response = await api.get<
    ResponseDto<ServicePageModel<ServicesResponseDto>>
  >("api/Service/active", {
    params: { keyword, pageSize, pageIndex, sortField, sortOrder },
  });
  return response.data;
};

/**
 * Hàm lấy tất cả các service dùng cho Service Home
 * @param keyword
 * @param pageSize
 * @param pageIndex
 * @param sortField
 * @param sortOrder
 * @returns
 */
export const getAllActiveService = (
  keyword?: string,
  pageSize?: number,
  pageIndex?: number,
  sortField?: string,
  sortOrder?: string
) => {
  return useQuery({
    queryKey: ["Services", keyword, pageSize, pageIndex, sortField, sortOrder],
    queryFn: () =>
      fetchServiceData(keyword, pageSize, pageIndex, sortField, sortOrder),
  });
};

export const useGetAllServices = (params: GetServiceParams) => {
  return useQuery({
    queryKey: ["Services", params],
    queryFn: async () => {
      try {
        const response = await api.get<
          ResponseDto<ServicePageModel<ServicesResponseDto>>
        >("api/Service/active", {
          params,
        });
        return response.data;
      } catch (error) {
        handleError(error);
        if (axios.isAxiosError(error)) {
          const errMsg =
            error.response?.data?.message ||
            error.message ||
            ERROR_MESSAGE.FETCH_DATA_FAILED;
          throw new Error(errMsg);
        }
        throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      }
    },
  });
};
