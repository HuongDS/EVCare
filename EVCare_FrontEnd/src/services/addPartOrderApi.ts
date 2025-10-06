// addPartsToOrder.ts
import { api } from "../api/api";
import type {
  ResponseDto,
  AddPartsRequest,
  AddPartsResponse,
} from "../models/OrderPartModel/OrderPartAddTechnician";
import { handleError } from "../utils/errorHandler";
import { ERROR_MESSAGE } from "../constants/messages/Message";

export async function addPartsToOrder(request: AddPartsRequest) {
  try {
    const response = await api.post<ResponseDto<AddPartsResponse>>(
      "/api/Order/add-parts-to-order",
      request
    );

    return response.data;
  } catch (error) {
    handleError(error);
    return {
      statusCode: 500,
      message: ERROR_MESSAGE.SOME_THING_WENT_WRONG,
      data: null,
    } as ResponseDto<null>;
  }
}
