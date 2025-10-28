// src/services/appointmentPartCondition.ts
import axios from "axios";
import { api } from "../api/api";
import type {
  AppointmentPartCondition,
  ResponseDto,
  UpdatePartDamageDto,
} from "../models/OrderPartModel/AppointmentPartCondition";
import { ERROR_MESSAGE } from "../constants/messages/Message";

export async function createAppointmentPartCondition(
  data: AppointmentPartCondition
) {
  try {
    const response = await api.post<ResponseDto<AppointmentPartCondition>>(
      "/api/AppointmentPartCondition",
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.FETCH_DATA_FAILED);
  }
}

export async function updateAppointmentPartCondition(
  data: UpdatePartDamageDto
) {
  try {
    const response = await api.put<ResponseDto<UpdatePartDamageDto>>(
      "/api/AppointmentPartCondition",
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.FAILED_TO_UPDATE_PART);
  }
}

export async function getAppointmentPartCondition(appointmentId: number) {
  try {
    const response = await api.get<ResponseDto<AppointmentPartCondition>>(
      `/api/AppointmentPartCondition/`,
      { params: { appointmentId } }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.FETCH_DATA_FAILED);
  }
}
