import { api } from "../api/api";
import type {
  ChangeAppointmentStatusParams,
  GetAppointmentsParams,
  PageModel,
  ResponseDto,
  StaffAppointmentsDto,
} from "../models/AppointmentsModel/Staff_Appointments_Model";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import type { AppointmentCreateModel } from "../models/AppointmentsModel/AppointmentCreateModel";
import { handleError } from "../utils/errorHandler";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import { store } from "../states/store";
import { setGlobalError } from "../states/errorSlice";
import type { AppointmentViewModel } from "../models/AppointmentsModel/AppointmentViewModel";
import type {
  GetTechnicianParams,
  TechnicianModel,
} from "../models/AppointmentsModel/Technician_Appointments_Model";
import type { ServicesResponseDto } from "../models/ServicesModel/Customer_Services_Model";

//[STAFF]: Get All appointments

export const useGetAllAppointments = (params: GetAppointmentsParams = {}) => {
  return useQuery({
    queryKey: ["Staff Appointments", params],
    queryFn: async () => {
      const response = await api.get<
        ResponseDto<PageModel<StaffAppointmentsDto>>
      >("api/Appointment/appointments/paged", { params });
      return response.data;
    },
  });
};

export async function createAppointment(data: AppointmentCreateModel) {
  try {
    const response = await api.post<ResponseDto<number | null>>(
      "/api/Appointment/customer",
      data
    );
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg =
        error.response?.data.message ||
        error.message ||
        ERROR_MESSAGE.CREATE_APPOINTMENT_FAILED;
      store.dispatch(setGlobalError(errMsg));
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.CREATE_APPOINTMENT_FAILED);
  }
}

export async function getCustomerAppointment() {
  try {
    const response = await api.get<ResponseDto<AppointmentViewModel[]>>(
      "/api/Appointment/history"
    );
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg =
        error.response?.data.message ||
        error.message ||
        ERROR_MESSAGE.FETCH_DATA_FAILED;
      store.dispatch(setGlobalError(errMsg));
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

//[STAFF] - NGO CHI VY: Set Appointment Status - Appointment Steps
export const changeAppointmentStatus = async (
  params: ChangeAppointmentStatusParams
) => {
  const response = await api.put<ResponseDto<boolean | null>>(
    "/api/Appointment/staff",
    params
  );
  return response.data;
};

//[STAFF] - NGO CHI VY: Get technicians today for assigning work
export const useGetTechniciansToday = (params: GetTechnicianParams) => {
  return useQuery({
    queryKey: ["TechniciansToday", params],
    queryFn: async () => {
      const response = await api.get<
        ResponseDto<PageModel<TechnicianModel<ServicesResponseDto[]>>>
      >("/api/Technician/get-technician-today", { params });
      return response.data;
    },
  });
};
