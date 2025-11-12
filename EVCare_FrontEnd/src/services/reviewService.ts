import axios from "axios";
import { api } from "../api/api";
import type { ReviewCreateDto } from "../models/Review/ReviewCreateDto";
import type { ReviewResponseDto, ResponseDto } from "../models/Review/ReviewResponseDto";
import { handleError } from "../utils/errorHandler";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import type { PageResultDto } from "../models/PageResult/PageResultDto";

export async function review(data: ReviewCreateDto) {
  try {
    await api.post("/api/Review", data);
  } catch (error) {
    handleError(error);
    throw new Error((error as Error).message);
  }
}

export async function getAllReview(params: {
  minRating: number;
  maxRating: number;
  serviceIds?: number[];
  pageSize: number;
  pageIndex: number;
  sortField: string;
  sortOrder: string;
}) {
  try {
    const response = await api.get<ResponseDto<PageResultDto<ReviewResponseDto>>>("/api/Review", { params: params });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.message || error.response?.data.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}
