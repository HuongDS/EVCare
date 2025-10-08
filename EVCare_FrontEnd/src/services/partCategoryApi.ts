import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import type {
  ResponseDto,
  PageModel,
  CategoryResponseDTO,
} from "../models/OrderPartModel/Category_Model";
import { handleError } from "../utils/errorHandler";

interface GetPartCategoryParams {
  pageSize?: number;
  pageIndex?: number;
}

export async function getPartCategories(params?: GetPartCategoryParams) {
  try {
    const response = await api.get<ResponseDto<PageModel<CategoryResponseDTO>>>(
      "/api/PartCategory",
      {
        params: {
          PageSize: params?.pageSize ?? 10,
          PageIndex: params?.pageIndex ?? 1,
        },
      }
    );
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
