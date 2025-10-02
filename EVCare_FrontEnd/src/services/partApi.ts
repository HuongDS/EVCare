import { api } from "../api/api";
import type {
  OrderPartsResponseDto,
  ResponseDto,
} from "../models/OrderPartModel/Order_Parts_Model";
import { handleError } from "../utils/errorHandler";

export async function getAllParts({
  partName,
  categoryId,
  pageSize,
  pageIndex,
}: {
  partName?: string;
  categoryId?: number;
  pageSize?: number;
  pageIndex?: number;
} = {}) {
  try {
    const response = await api.get<ResponseDto<OrderPartsResponseDto[]>>(
      "/api/Part",
      {
        params: {
          PartName: partName,
          CategoryId: categoryId,
          PageSize: pageSize,
          PageIndex: pageIndex,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
}
