//getApplicationApi.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import type {
  ResponseDto,
  ApplicationResponseDTO,
  DateOffResponseDTO,
  PageModel,
  GetApplicationsParams,
} from "../models/ApplicationModel/ApplicationModels";
import { handleError } from "../utils/errorHandler";
import axios, { isAxiosError } from "axios";
import { store } from "../states/store";
import { setGlobalError } from "../states/errorSlice";
import { ERROR_MESSAGE } from "../constants/messages/Message";

export async function getDateOff(): Promise<ResponseDto<DateOffResponseDTO>> {
  try {
    const response = await api.get<ResponseDto<DateOffResponseDTO>>("/api/Application/get-dateoff");
    return response.data;
  } catch (error) {
    handleError(error);
    return {
      statusCode: 500,
      message: "Failed to get blocked dates",
      data: [],
    };
  }
}

export async function getApplications(params?: GetApplicationsParams) {
  try {
    const response = await api.get<ResponseDto<PageModel<ApplicationResponseDTO>>>("/api/Application/get-application", {
      params,
    });
    return response.data;
  } catch (error) {
    handleError(error);
    if (isAxiosError(error)) {
      const errMsg = error.message || error.response?.data.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export const useGetApplication = (params?: GetApplicationsParams) => {
  return useQuery({
    queryKey: ["Application", params],
    queryFn: async () => {
      try {
        const response = await api.get<ResponseDto<PageModel<ApplicationResponseDTO>>>(
          "/api/Application/get-application",
          { params }
        );
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
    },
  });
};
