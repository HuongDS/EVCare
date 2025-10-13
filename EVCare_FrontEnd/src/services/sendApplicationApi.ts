// sendApplication.ts
import { api } from "../api/api";
import type {
  ResponseDto,
  ApplicationRequestDTO,
  ApplicationResponseDTO,
} from "../models/ApplicationModel/ApplicationModels";
import { handleError } from "../utils/errorHandler";

export async function sendApplication(
  request: ApplicationRequestDTO
): Promise<ResponseDto<ApplicationResponseDTO | null>> {
  try {
    const response = await api.post<ResponseDto<ApplicationResponseDTO>>(
      "/api/Application/send-application",
      request
    );

    return response.data;
  } catch (error) {
    handleError(error);
    return {
      statusCode: 500,
      message: "Failed to send application",
      data: null,
    } as ResponseDto<null>;
  }
}
