import axios from "axios";
import type { BlockDateCreateDto } from "../models/ServiceCenter/BlockDateCreateDto";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import { api } from "../api/api";
import type { ResponseDto } from "../models/AuthModel/authModel";
import type { BlockDateViewDto } from "../models/ServiceCenter/BlockDateViewDto";

export async function createBlockDate(data: BlockDateCreateDto) {
  try {
    const response = await api.post<ResponseDto<number>>("/api/BlockedDate", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.message || error.response?.data.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export async function getBlockDates() {
  try {
    const response = await api.get<ResponseDto<BlockDateViewDto[]>>("/api/BlockedDate");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.message || error.response?.data.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export async function updateBlockDate(data: BlockDateCreateDto) {
  try {
    const response = await api.put<ResponseDto<object>>("/api/BlockedDate", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.message || error.response?.data.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export async function deleteBlockDate(data: string) {
  try {
    const response = await api.delete<ResponseDto<object>>("/api/BlockedDate", {
      params: {
        date: data,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.message || error.response?.data.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}
