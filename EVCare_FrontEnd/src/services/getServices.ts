import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import type {
  ResponseDto,
  ServicesResponseDto,
} from "../models/ServicesModel/serviceModel";

/**
 * Get all active services
 * @returns Object: status code, message, data
 */
export const getActiveServices = (
  keyword?: string,
  payload?: number,
  pageindex?: number
) => {
  const fetchServiceData = async () => {
    const response = await api.get<ResponseDto<ServicesResponseDto[]>>(
      "api/Service/active",
      {
        params: { keyword, payload, pageindex },
      }
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["Services", keyword, payload, pageindex],
    queryFn: fetchServiceData,
  });
};
