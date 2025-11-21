import axios from "axios";
import { api } from "../api/api";
import type { ResponseDto } from "../models/AuthModel/authModel";
import type { VehicleCategoryWithScaleViewDto } from "../models/VehicleModels/vehicleCategoryViewDto";
import type { VehicleCreateDto } from "../models/VehicleModels/VehicleCreateDto";
import type { VehicleViewDto } from "../models/VehicleModels/vehicleViewDto";
import { handleError } from "../utils/errorHandler";
import { store } from "../states/store";
import { setGlobalError } from "../states/errorSlice";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import type { VehicleCategoryCreateDto } from "../models/VehicleModels/VehicleCategoryCreateDto";
import type { VehicleCategoryViewPartModel } from "../models/VehicleModels/VehicleCategoryViewPartModel";

export async function getVehicleByCustomerId(customerId: number) {
  try {
    const response = await api.get<ResponseDto<VehicleViewDto[]>>(`/api/Vehicle/customer/${customerId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getVehicleCategories(pageSize?: number) {
  try {
    const response = await api.get<ResponseDto<VehicleCategoryWithScaleViewDto[]>>("/api/VehicleCategory/active", {
      params: {
        pageSize: pageSize ?? 1000,
      },
    });
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
      const errMsg = error.response?.data?.message || error.message || ERROR_MESSAGE.CREATE_VEHICLE_FAILED;
      store.dispatch(setGlobalError(errMsg));
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.CREATE_VEHICLE_FAILED);
  }
}

export async function deleteVehicle(vehicleId: number) {
  try {
    const response = await api.put<ResponseDto<number>>(`/api/Vehicle/delete-vehicle/${vehicleId}`);
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data?.message || error.message || ERROR_MESSAGE.FAILED_TO_ADD_VEHICLE;
      store.dispatch(setGlobalError(errMsg));
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.FAILED_TO_ADD_VEHICLE);
  }
}

export async function createVehicleCategory(data: VehicleCategoryCreateDto) {
  try {
    const response = await api.post<ResponseDto<number>>("/api/VehicleCategory", data);
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data?.message || error.message;
      store.dispatch(setGlobalError(errMsg));
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export async function deleteVehicleCategory(data: number) {
  try {
    await api.delete(`/api/VehicleCategory/${data}`);
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data?.message || error.message;
      store.dispatch(setGlobalError(errMsg));
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export async function updateVehicleCategory(id: number, data: VehicleCategoryCreateDto) {
  try {
    const response = await api.put(`/api/VehicleCategory/${id}`, data);
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data?.message || error.message;
      store.dispatch(setGlobalError(errMsg));
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export async function getDetailVehicleCategory(id: number) {
  try {
    const response = await api.get<ResponseDto<VehicleCategoryViewPartModel>>(`/api/VehicleCategory/${id}/detail`);
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data?.message || error.message;
      store.dispatch(setGlobalError(errMsg));
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export async function process3DFile(data: File) {
  try {
    const formData = new FormData();
    formData.append("file", data);
    const response = await api.post<ResponseDto<string>>("/api/File/model3d", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data?.message || error.message;
      store.dispatch(setGlobalError(errMsg));
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}
