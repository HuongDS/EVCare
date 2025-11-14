import axios from "axios";
import { api } from "../api/api";
import type {
  AppointmentPartCondition,
  PartDamageLevelDetail,
  ResponseDto,
  UpdatePartDamageDto,
} from "../models/OrderPartModel/AppointmentPartCondition";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import { useMutation, useQuery } from "@tanstack/react-query";
import { handleError } from "../utils/errorHandler";

export const useSetPartCondition = () => {
  return useMutation({
    mutationKey: ["SetCondition"],
    mutationFn: async (data: PartDamageLevelDetail) => {
      try {
        const response = await api.post<
          ResponseDto<AppointmentPartCondition<PartDamageLevelDetail>>
        >("/api/AppointmentPartCondition", data);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errMsg = error.response?.data.message || error.message;
          throw new Error(errMsg);
        }
        throw new Error(ERROR_MESSAGE.FETCH_DATA_FAILED);
      }
    },
  });
};

export const useUpdatePartCondition = () => {
  return useMutation({
    mutationKey: ["UpdatePartCondition"],
    mutationFn: async (payload: UpdatePartDamageDto) => {
      try {
        const response = await api.put<ResponseDto<UpdatePartDamageDto>>(
          "/api/AppointmentPartCondition",
          payload
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errMsg = error.response?.data.message || error.message;
          throw new Error(errMsg);
        }
        throw new Error(ERROR_MESSAGE.FAILED_TO_UPDATE_PART);
      }
    },
  });
};

export const useGetAppointmentPartCondition = (appointmentId: number) => {
  return useQuery({
    queryKey: ["AppointmentHasCondition", appointmentId],
    queryFn: async () => {
      try {
        const response = await api.get<
          ResponseDto<AppointmentPartCondition<PartDamageLevelDetail>>
        >("/api/AppointmentPartCondition/", { params: { appointmentId } });
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
