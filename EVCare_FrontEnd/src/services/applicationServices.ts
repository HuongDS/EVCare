import axios from "axios";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import { api } from "../api/api";
import type { ResponseDto } from "../models/AuthModel/authModel";
import type { PageResultDto } from "../models/PageResult/PageResultDto";
import type { ApplicationAdminViewDto } from "../models/ApplicationModel/ApplicationAdminViewDto";
import type { ApplicationStatusEnum } from "../models/enums/ApplicationStatusEnum";
import type { ApplicationUpdateDto } from "../models/ApplicationModel/ApplicationUpdateDto";

export async function getAllAplications(params: {
  status?: ApplicationStatusEnum | null;
  keyword?: string;
  fromDate?: string;
  toDate?: string;
  pageSize?: number;
  pageIndex?: number;
}) {
  try {
    const response = await api.get<ResponseDto<PageResultDto<ApplicationAdminViewDto>>>("/api/Application", {
      params: params,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export async function processApplication(data: ApplicationUpdateDto) {
  try {
    const response = await api.put("/api/Application", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}
