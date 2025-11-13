import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import type {
  PartAddByTech,
  ResponseDto,
} from "../models/OrderPartModel/OrderTechnicianAdded";
import { handleError } from "../utils/errorHandler";
import axios from "axios";
import { ERROR_MESSAGE } from "../constants/messages/Message";

export const useGetPartOrderByTech = (orderId?: number) => {
  return useQuery({
    queryKey: ["TechnicianAddedParts", orderId],
    queryFn: async () => {
      try {
        const response = await api.get<ResponseDto<PartAddByTech[]>>(
          "/api/Order/technician-orders",
          { params: { orderId } }
        );
        return response.data;
      } catch (error) {
        handleError(error);
        if (axios.isAxiosError(error)) {
          const errMsg =
            error.response?.data.message ||
            error.message ||
            ERROR_MESSAGE.FETCH_DATA_FAILED;
          throw new Error(errMsg);
        }
        throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      }
    },
    enabled: !!orderId,
    staleTime: 1000 * 60,
  });
};
