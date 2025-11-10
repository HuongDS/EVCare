import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import type {
  ResponseDto,
  PageModel,
  TechnicianAppointmentsDto,
} from "../models/AppointmentsModel/Technician_Appointments_Model";
import { handleError } from "../utils/errorHandler";

/**
 * [TECHNICIAN] - Get all appointments for technician (with caching)
 */
export const useGetTechnicianAppointments = (params?: {
  Status?: string;
  BeginTime?: string;
  EndTime?: string;
  PageSize?: number;
  PageIndex?: number;
}) => {
  return useQuery({
    queryKey: ["TechnicianAppointments", params],
    queryFn: async (): Promise<PageModel<TechnicianAppointmentsDto>> => {
      try {
        const response = await api.get<ResponseDto<PageModel<TechnicianAppointmentsDto>>>(
          "/api/Appointment/get-appointment-technician",
          { params }
        );

        const data = response.data?.data;

        return {
          items: data?.items ?? [],
          pageSize: data?.pageSize ?? params?.PageSize ?? 10,
          pageIndex: data?.pageIndex ?? params?.PageIndex ?? 1,
          totalItems: data?.totalItems ?? 0,
          totalPages: data?.totalPages ?? 1,
        };
      } catch (error) {
        handleError(error);
        return {
          items: [],
          pageSize: params?.PageSize ?? 10,
          pageIndex: params?.PageIndex ?? 1,
          totalItems: 0,
          totalPages: 1,
        };
      }
    },

    // staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    // refetchOnWindowFocus: false,
    retry: 1,
  });
};
