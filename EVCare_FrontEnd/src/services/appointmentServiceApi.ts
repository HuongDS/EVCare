import { api } from "../api/api";
import type {
  PageModel,
  ResponseDto,
  StaffAppointmentsDto,
} from "../models/AppointmentsModel/Staff_Appointments_Model";
import { useQuery } from "@tanstack/react-query";

interface GetAppointmentsParams {
  customerName?: string;
  status?: string;
  beginTime?: Date;
  endTime?: Date;
  pageSize?: number;
  pageIndex?: number;
  sortField?: string;
  sortOrder?: string;
}

//[STAFF]: Get All appointments
const fetchAppointmentsData = async (params: GetAppointmentsParams) => {
  const response = await api.get<ResponseDto<PageModel<StaffAppointmentsDto>>>(
    "api/Appointment/appointments/paged",
    { params }
  );
  return response.data;
};

export const useGetAllAppointments = (params: GetAppointmentsParams = {}) => {
  return useQuery({
    queryKey: ["Staff Appointments", params],
    queryFn: () => fetchAppointmentsData(params),
  });
};
