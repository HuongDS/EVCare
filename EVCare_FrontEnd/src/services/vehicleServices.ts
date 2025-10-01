import axios from "axios";
import { api } from "../api/api";
import type { ResponseDto } from "../models/AuthModel/authModel";
import type { VehicleCategoryViewDto } from "../models/VehicleModels/vehicleCategoryViewDto";
import type { VehicleCreateDto } from "../models/VehicleModels/VehicleCreateDto";
import type { VehicleViewDto } from "../models/VehicleModels/vehicleViewDto";
import { handleError } from "../utils/errorHandler";
import { store } from "../states/store";
import { setGlobalError } from "../states/errorSlice";
import { ERROR_MESSAGE } from "../constants/messages/Message";

export async function getVehicleByCustomerId(customerId: number) {
  try {
    const response = await api.get<ResponseDto<VehicleViewDto[]>>(`/api/Vehicle/customer/${customerId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getVehicleCategories() {
  try {
    const response = await api.get<ResponseDto<VehicleCategoryViewDto[]>>("/api/VehicleCategory/active");
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function createVehicle(data: VehicleCreateDto) {
  try {
    const response = await api.post<ResponseDto<number>>("/api/Vehicle", data);
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.message;
      store.dispatch(setGlobalError(errMsg));
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.CREATE_VEHICLE_FAILED);
  }
}
