import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import type { ResponseDto } from "../models/AuthModel/authModel";
import type { CustomerViewDto } from "../models/CustomerModels/CustomerViewDto";
import { handleError } from "../utils/errorHandler";

export async function getCustomerId(accountId: number) {
  try {
    const response = await api.get<ResponseDto<CustomerViewDto>>(
      `/api/Customer/${accountId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export const useGetCustomerID = (accountId: number) => {
  return useQuery({
    queryKey: ["CustomerID", accountId],
    queryFn: async () => {
      try {
        const response = await api.get<ResponseDto<CustomerViewDto>>(
          `/api/Customer/${accountId}`
        );
        return response.data;
      } catch (error) {
        handleError(error);
        return null;
      }
    },
    enabled: !!accountId,
  });
};
