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
