import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import type {
  ResponseDto,
  ServicePageModel,
  ServicesResponseDto,
} from "../models/ServicesModel/Customer_Services_Model";

//[STAFF, CUSTOMER, ADMIN] - Get all active services
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
