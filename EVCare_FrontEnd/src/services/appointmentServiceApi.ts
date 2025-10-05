import { useDispatch } from "react-redux";
import { api } from "../api/api";
import type {
  PageModel,
  ResponseDto,
  StaffAppointmentsDto,
} from "../models/AppointmentsModel/Staff_Appointments_Model";
import { useQuery } from "@tanstack/react-query";
import type { AppDispatch } from "../states/store";
import { useEffect } from "react";
import {
  setAppointments,
  setError,
  setLoading,
} from "../states/appointmentSlice";

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
import axios from "axios";
import type { AppointmentCreateModel } from "../models/AppointmentsModel/AppointmentCreateModel";
import { handleError } from "../utils/errorHandler";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import { store } from "../states/store";
import { setGlobalError } from "../states/errorSlice";
import type { AppointmentViewModel } from "../models/AppointmentsModel/AppointmentViewModel";

//[STAFF]: Get All appointments
const fetchAppointmentsData = async (params: GetAppointmentsParams) => {
  const response = await api.get<ResponseDto<PageModel<StaffAppointmentsDto>>>(
    "api/Appointment/appointments/paged",
    { params }
  );
  return response.data;
};

export const useGetAllAppointments = (params: GetAppointmentsParams = {}) => {
  const dispatch = useDispatch<AppDispatch>();
  const query = useQuery({
    queryKey: ["Staff Appointments", params],
    queryFn: () => fetchAppointmentsData(params),
  });

  useEffect(() => {
    if (query.data?.data) {
      dispatch(setAppointments(query.data.data));
      dispatch(setLoading(false));
      dispatch(setError(null));
    }
    if (query.isError) {
      dispatch(setError(query.error?.message ?? "Fetch error"));
      dispatch(setLoading(false));
    }
  }, [query.data, dispatch, query.isError, query.error]);

  return query;
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
