import { api } from "../api/api";
import type { ReviewCreateDto } from "../models/Review/ReviewCreateDto";
import type { ReviewResponseDto, ResponseDto, PageModel } from "../models/Review/ReviewResponseDto";
import { handleError } from "../utils/errorHandler";

export async function review(data: ReviewCreateDto) {
  try {
    await api.post("/api/Review", data);
  } catch (error) {
    handleError(error);
    throw new Error((error as Error).message);
  }
}

export async function getAllReview(): Promise<ResponseDto<PageModel<ReviewResponseDto>>> {
  try {
    const response = await api.get("/api/Review");
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
