import { api } from "../api/api";
import type {
  ResponseDto,
  PageModel,
  TechnicianAppointmentsDto,
} from "../models/AppointmentsModel/Technician_Appointments_Model";
import { handleError } from "../utils/errorHandler";

export async function getTechnicianAppointments(params?: {
  status?: number;
  beginTime?: string;
  endTime?: string;
  pageSize?: number;
  pageIndex?: number;
}) {
  try {
    const response = await api.get<
      ResponseDto<PageModel<TechnicianAppointmentsDto>>
    >("/api/Appointment/get-appointment-technician", { params });

    return (
      response.data.data ?? {
        items: [],
        pageSize: params?.pageSize ?? 10,
        pageIndex: params?.pageIndex ?? 1,
        totalItems: 0,
        totalPages: 1,
      }
    );
  } catch (error) {
    handleError(error);
    return {
      items: [],
      pageSize: params?.pageSize ?? 10,
      pageIndex: params?.pageIndex ?? 1,
      totalItems: 0,
      totalPages: 1,
    };
  }
}
