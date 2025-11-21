import axios from "axios";
import { handleError } from "../utils/errorHandler";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import { api } from "../api/api";
import type { ResponseDto } from "../models/AuthModel/authModel";
import type { ServiceCenterViewModel } from "../models/ServiceCenter/ServiceCenterViewModel";
import type { BlockedDateViewModel } from "../models/BlockedDate/BlockedDateViewModel";
import type { ServiceCenterAdminModel } from "../models/ServiceCenter/ServiceCenterAdminModel";

export async function getCenterInformation() {
  try {
    const response = await api.get<ResponseDto<ServiceCenterViewModel>>("/api/ServiceCenter");
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export async function getBlockedDate() {
  try {
    const response = await api.get<ResponseDto<BlockedDateViewModel[]>>("/api/BlockedDate");
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export async function updateCenterInformation(data: ServiceCenterAdminModel) {
  try {
    const response = await api.put("/api/ServiceCenter", data);
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export async function adminGetCenterInformation() {
  try {
    const response = await api.get<ResponseDto<ServiceCenterAdminModel>>("/api/ServiceCenter");
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}
