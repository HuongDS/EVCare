import { useMutation } from "@tanstack/react-query";
import { api } from "../api/api";
import type { ResponseDto } from "../models/AppointmentsModel/Technician_Appointments_Model";
import { handleError } from "../utils/errorHandler";
import axios from "axios";
import { ERROR_MESSAGE } from "../constants/messages/Message";

type paymentParams = {
  orderId: number;
  total_Price: number;
  payment_Method: string;
};

export const usePayByPayOS = () => {
  return useMutation({
    mutationKey: ["Invoice"],
    mutationFn: async (params: paymentParams) => {
      try {
        const response = await api.post<ResponseDto<string>>(
          "/api/Invoice",
          params
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
  });
};
