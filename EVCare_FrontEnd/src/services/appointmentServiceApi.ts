import { api } from "../api/api";
import type { PageModel, StaffAppointmentsDto } from "../models/AppointmentsModel/Staff_Appointments_Model";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { AppointmentCreateModel } from "../models/AppointmentsModel/AppointmentCreateModel";
import type { ResponseDto } from "../models/ServicesModel/Customer_Services_Model";
import { handleError } from "../utils/errorHandler";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import { store } from "../states/store";
import { setGlobalError } from "../states/errorSlice";
import type { AppointmentViewModel } from "../models/AppointmentsModel/AppointmentViewModel";

//[STAFF]: Get All appointments
const fetchAppointmentsData = async (customerName?: string, payload?: number, pageindex?: number) => {
  const response = await api.get<ResponseDto<PageModel<StaffAppointmentsDto>>>("api/Appointment/appointments/paged", {
    params: { customerName, payload, pageindex },
  });
  return response.data;
};

export const useGetAllAppointments = (customerName?: string, payload?: number, pageindex?: number) => {
  return useQuery({
    queryKey: ["Staff Appointments", params],
    queryFn: () => fetchAppointmentsData(params),
  });
};

export async function createAppointment(data: AppointmentCreateModel) {
  try {
    const response = await api.post<ResponseDto<number | null>>("/api/Appointment/customer", data);
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message || ERROR_MESSAGE.CREATE_APPOINTMENT_FAILED;
      store.dispatch(setGlobalError(errMsg));
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.CREATE_APPOINTMENT_FAILED);
  }
}

export async function getCustomerAppointment() {
  try {
    const response = await api.get<ResponseDto<AppointmentViewModel[]>>("/api/Appointment/history");
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message || ERROR_MESSAGE.FETCH_DATA_FAILED;
      store.dispatch(setGlobalError(errMsg));
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}
