import { api } from "../api/api";
import type {
  ResponseDto,
  PageModel,
  OrderPartsResponseDto,
} from "../models/OrderPartModel/Order_Parts_Model";
import { handleError } from "../utils/errorHandler";

export async function getAllParts(params?: {
  partName?: string;
  categoryId?: number;
  pageSize?: number;
  pageIndex?: number;
}) {
  try {
    const response = await api.get<
      ResponseDto<PageModel<OrderPartsResponseDto>>
    >("/api/Part", {
      params,
    });

    return (
      response.data.data ?? {
        items: [],
        pageSize: params?.pageSize ?? 8,
        pageIndex: 1,
        totalItems: 0,
        totalPages: 1,
      }
    );
  } catch (error) {
    handleError(error);
    return {
      items: [],
      pageSize: params?.pageSize ?? 8,
      pageIndex: 1,
      totalItems: 0,
      totalPages: 1,
    };
  }
}
