import { useMutation } from "@tanstack/react-query";
import { api } from "../api/api";
import type {
  ResponseDto,
  TechnicianAppointmentsDto,
} from "../models/AppointmentsModel/Technician_Appointments_Model";
import { handleError } from "../utils/errorHandler";
import axios from "axios";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import QueryString from "qs";

/**
 * @param payload { orderId, status }
 */
export const useUpdateTechnicianWorkingSession = () => {
  return useMutation({
    mutationKey: ["TechnicianWorkingSession"],
    mutationFn: async (payload: { orderId: number; status: string }) => {
      try {
        const response = await api.put<ResponseDto<TechnicianAppointmentsDto>>(
          "/api/TechnicianWorkingSession/my-working-session",
          payload
        );
        return response.data;
      } catch (error) {
        handleError(error);
        if (axios.isAxiosError(error)) {
          const errMsg = error.response?.data.message || error.message;
          throw new Error(errMsg);
        }
        throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      }
    },
  });
};

export const useFinishTechnicianSession = () => {
  return useMutation({
    mutationKey: ["finish"],
    mutationFn: async (payload: {
      technicianId: number[];
      orderId: number;
    }) => {
      try {
        const response = await api.put<ResponseDto<number>>(
          "/api/TechnicianWorkingSession/technician-status",
          null,
          {
            params: {
              technicianId: payload.technicianId,
              orderId: payload.orderId,
            },
            paramsSerializer: (p: any) =>
              QueryString.stringify(p, { arrayFormat: "repeat" }),
          }
        );
        return response.data;
      } catch (error) {
        handleError(error);
        if (axios.isAxiosError(error)) {
          const errMsg = error.response?.data.message || error.message;
          throw new Error(errMsg);
        }
        throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      }
    },
  });
};
