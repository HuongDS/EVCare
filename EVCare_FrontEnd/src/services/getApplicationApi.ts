//getApplicationApi.ts
import { api } from "../api/api";
import type {
  ResponseDto,
  ApplicationResponseDTO,
  DateOffResponseDTO,
  PageModel,
  GetApplicationsParams,
} from "../models/ApplicationModel/ApplicationModels";
import { handleError } from "../utils/errorHandler";

// ===== GET blocked dates =====
export async function getDateOff(): Promise<ResponseDto<DateOffResponseDTO>> {
  try {
    const response = await api.get<ResponseDto<DateOffResponseDTO>>(
      "/api/Application/get-dateoff"
    );
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

// ===== GET applications =====
export async function getApplications(
  params?: GetApplicationsParams
): Promise<ResponseDto<PageModel<ApplicationResponseDTO>>> {
  try {
    const response = await api.get<
      ResponseDto<PageModel<ApplicationResponseDTO>>
    >("/api/Application/get-application", { params });
    return response.data;
  } catch (error) {
    handleError(error);
    return {
      statusCode: 500,
      message: "Failed to get applications",
      data: {
        items: [],
        pageSize: 0,
        pageIndex: 0,
        totalItems: 0,
        totalPages: 0,
      },
    };
  }
}
