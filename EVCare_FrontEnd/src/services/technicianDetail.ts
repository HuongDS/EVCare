import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import type { ResponseDto } from "../models/AppointmentsModel/Technician_Appointments_Model";
import type { TechnicianDetailModel } from "../models/Techinician/TechnicianDetailModel";
import { handleError } from "../utils/errorHandler";
import axios from "axios";
import { ERROR_MESSAGE } from "../constants/messages/Message";

export const useGetTechnicianDetail = (technicianId?: number) => {
  return useQuery({
    queryKey: ["technicianDetail", technicianId],
    queryFn: async () => {
      try {
        const response = await api.get<ResponseDto<TechnicianDetailModel>>(
          `/api/Technician/detail/${technicianId}`
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
    enabled: !!technicianId,
  });
};
