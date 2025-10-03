import axios from "axios";
import { api } from "../api/api";
import type { AppointmentCreateModel } from "../models/AppointmentsModel/AppointmentCreateModel";
import type { ResponseDto } from "../models/ServicesModel/Customer_Services_Model";
import { handleError } from "../utils/errorHandler";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import { store } from "../states/store";
import { setGlobalError } from "../states/errorSlice";

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
