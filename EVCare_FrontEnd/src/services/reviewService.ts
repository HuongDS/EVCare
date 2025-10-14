import { api } from "../api/api";
import type { ReviewCreateDto } from "../models/Review/ReviewCreateDto";
import { handleError } from "../utils/errorHandler";

export async function review(data: ReviewCreateDto) {
  try {
    await api.post("/api/Review", data);
  } catch (error) {
    handleError(error);
    throw new Error(error as string);
  }
}
