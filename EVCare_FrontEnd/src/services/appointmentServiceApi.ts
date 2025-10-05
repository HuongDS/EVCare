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
