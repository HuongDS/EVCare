import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import type { ResponseDto, PageModel, CategoryResponseDTO } from "../models/OrderPartModel/Category_Model";
import { handleError } from "../utils/errorHandler";
import type { PartCategoryCreateDto } from "../models/PartModel/PartCategoryCreateDto";
import axios from "axios";
import { ERROR_MESSAGE } from "../constants/messages/Message";

interface GetPartCategoryParams {
  pageSize?: number;
  pageIndex?: number;
}

export async function getPartCategories(params?: GetPartCategoryParams) {
  try {
    const response = await api.get<ResponseDto<PageModel<CategoryResponseDTO>>>("/api/PartCategory", {
      params: {
        PageSize: params?.pageSize ?? 10,
        PageIndex: params?.pageIndex ?? 1,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export const useGetPartCategories = (params?: GetPartCategoryParams) => {
  return useQuery({
    queryKey: ["PartCategories", params],
    queryFn: () => getPartCategories(params),
  });
};

export async function createPartCategory(data: PartCategoryCreateDto) {
  try {
    const response = await api.post<ResponseDto<number>>("/api/PartCategory", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data?.message || error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export async function deletePartCategory(id: number) {
  try {
    await api.delete(`/api/PartCategory/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data?.message || error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export async function updatePartCategory(id: number, data: PartCategoryCreateDto) {
  try {
    const response = await api.put("/api/PartCategory", data, {
      params: {
        id: id,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data?.message || error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}
