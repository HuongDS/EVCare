import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import type {
  ResponseDto,
  PageModel,
  TechnicianAppointmentsDto,
  ServiceViewModel,
  GetPartsInServicesParams,
} from "../models/AppointmentsModel/Technician_Appointments_Model";
import { handleError } from "../utils/errorHandler";
import axios from "axios";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import type { PartInServiceDetail } from "../models/PartModel/PartModel";
import QueryString from "qs";

export const useGetTechnicianAppointments = (params?: {
  Status?: string;
  BeginTime?: string;
  EndTime?: string;
  PageSize?: number;
  PageIndex?: number;
  SortField?: string;
  SortOrder?: string;
}) => {
  return useQuery({
    queryKey: ["TechnicianAppointments", params],
    queryFn: async () => {
      try {
        const response = await api.get<
          ResponseDto<PageModel<TechnicianAppointmentsDto>>
        >("/api/Appointment/get-appointment-technician", { params });

        return response.data;
      } catch (error) {
        handleError(error);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetServicesInAppointment = (params: {
  appointmentId: number;
}) => {
  return useQuery({
    queryKey: ["ServicesInAppointment", params],
    queryFn: async () => {
      try {
        const response = await api.get<ResponseDto<ServiceViewModel[]>>(
          "/api/Appointment/appointment-services",
          {
            params,
          }
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

export const useGetPartsInServices = (params: GetPartsInServicesParams) => {
  return useQuery({
    queryKey: ["PartsInService", params],
    queryFn: async () => {
      try {
        const response = await api.get<
          ResponseDto<PageModel<PartInServiceDetail>>
        >("/api/Part/service-parts", {
          params,
          paramsSerializer: (p) =>
            QueryString.stringify(p, { arrayFormat: "repeat" }),
        });
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
