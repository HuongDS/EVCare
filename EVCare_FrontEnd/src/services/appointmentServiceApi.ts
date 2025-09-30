import { api } from "../api/api";
import type {
  PageModel,
  ResponseDto,
  StaffAppointmentsDto,
} from "../models/AppointmentsModel/Staff_Appointments_Model";
import { useQuery } from "@tanstack/react-query";

//[STAFF]: Get All appointments
const fetchAppointmentsData = async (
  customerName?: string,
  payload?: number,
  pageindex?: number
) => {
  const response = await api.get<ResponseDto<PageModel<StaffAppointmentsDto>>>(
    "api/Appointment/appointments/paged",
    {
      params: { customerName, payload, pageindex },
    }
  );
  return response.data;
};

export const useGetAllAppointments = (
  customerName?: string,
  payload?: number,
  pageindex?: number
) => {
  return useQuery({
    queryKey: ["Staff Appointments", customerName, payload, pageindex],
    queryFn: () => fetchAppointmentsData(customerName, payload, pageindex),
  });
};
