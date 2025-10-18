import { api } from "../api/api";
import type { ReviewCreateDto } from "../models/Review/ReviewCreateDto";
import type {
  ReviewResponseDto,
  ResponseDto,
  PageModel,
} from "../models/Review/ReviewResponseDto";
import { handleError } from "../utils/errorHandler";

export async function review(data: ReviewCreateDto) {
  try {
    await api.post("/api/Review", data);
  } catch (error) {
    handleError(error);
    throw new Error(error as string);
  }
}

export async function getAllReview(
  pageIndex = 1,
  pageSize = 10,
  rating?: number | null,
  serviceIds?: number[]
): Promise<ResponseDto<PageModel<ReviewResponseDto>>> {
  try {
    const params: Record<string, unknown> = {
      pageIndex,
      pageSize,
    };

    if (rating !== null && rating !== undefined) params.rating = rating;
    if (serviceIds && serviceIds.length > 0)
      params.serviceIds = serviceIds.join(",");

    const response = await api.get("/api/Review", { params });
    return response.data;
  } catch (error) {
    handleError(error);
    return {
      statusCode: 500,
      message: "Failed to get reviews",
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
