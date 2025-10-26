import axios from "axios";
import { api } from "../api/api";
import type {
  ResponseDto,
  PageModel,
  OrderPartsResponseDto,
} from "../models/OrderPartModel/Order_Parts_Model";
import type { NewPartDto } from "../models/PartModel/NewPartDto";
import { handleError } from "../utils/errorHandler";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import type { Category, PartDetailDto } from "../models/PartModel/PartModel";
import type { PageResultDto } from "../models/PageResult/PageResultDto";

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

export async function createPart(data: NewPartDto) {
  try {
    const response = await api.post<ResponseDto<number>>("/api/Part", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.FETCH_DATA_FAILED);
  }
}

export async function updatePart(id: number, data: PartDetailDto) {
  try {
    await api.put("/api/Part", data, {
      params: {
        id: id,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.FAILED_TO_UPDATE_PART);
  }
}

export async function deletePart(data: number) {
  try {
    await api.delete(`/api/Part/${data}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.FAILED_TO_DELETE_PART);
  }
}

export async function getPartCategories() {
  try {
    const response = await api.get<ResponseDto<PageResultDto<Category>>>(
      "/api/PartCategory"
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.FETCH_DATA_FAILED);
  }
}

export async function getAllParts02(params?: {
  PartName?: string;
  PageSize?: number;
  PageIndex?: number;
}) {
  try {
    const response = await api.get<ResponseDto<PageModel<PartDetailDto>>>(
      "/api/Part",
      { params }
    );

    return (
      response.data.data ?? {
        items: [],
        pageSize: params?.PageSize ?? 8,
        pageIndex: 1,
        totalItems: 0,
        totalPages: 1,
      }
    );
  } catch (error) {
    handleError(error);
    return {
      items: [],
      pageSize: params?.PageSize ?? 8,
      pageIndex: 1,
      totalItems: 0,
      totalPages: 1,
    };
  }
}
