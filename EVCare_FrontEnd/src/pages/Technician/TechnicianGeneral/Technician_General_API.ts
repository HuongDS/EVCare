import { api } from "../../../api/api";
import type {
  PageModel,
  ResponseDto,
  TechnicianAppointmentsDto,
} from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { useQuery } from "@tanstack/react-query";

// Hàm gọi API
const fetchTechnicianAppointments = async (
  status?: number,
  beginTime?: string,
  endTime?: string,
  pageSize?: number,
  pageIndex?: number
) => {
  const response = await api.get<
    ResponseDto<PageModel<TechnicianAppointmentsDto>>
  >("api/Appointment/get-appointment-technician", {
    params: {
      Status: status,
      BeginTime: beginTime,
      EndTime: endTime,
      PageSize: pageSize,
      PageIndex: pageIndex,
    },
  });

  return response.data;
};

// Hook React Query
export const useGetTechnicianAppointments = (
  status?: number,
  beginTime?: string,
  endTime?: string,
  pageSize: number = 10,
  pageIndex: number = 1
) => {
  return useQuery({
    queryKey: [
      "TechnicianAppointments",
      status,
      beginTime,
      endTime,
      pageSize,
      pageIndex,
    ],
    queryFn: () =>
      fetchTechnicianAppointments(
        status,
        beginTime,
        endTime,
        pageSize,
        pageIndex
      ),
  });
};
