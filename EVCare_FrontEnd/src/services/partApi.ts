// services/partApi.ts
import { api } from "../api/api";
import type {
  OrderPartsResponseDto,
  ResponseDto,
} from "../models/OrderPartModel/Order_Parts_Model";
import { handleError } from "../utils/errorHandler";

interface PaginatedParts {
  items: OrderPartsResponseDto[];
  pageSize: number;
  pageIndex: number;
  totalItems: number;
  totalPages: number;
}

export async function getAllParts(params?: {
  partName?: string;
  categoryId?: number;
  pageSize?: number;
  pageIndex?: number;
}) {
  try {
    const response = await api.get<ResponseDto<PaginatedParts>>("/api/Part", {
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
