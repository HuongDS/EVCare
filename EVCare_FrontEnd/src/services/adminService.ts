import axios from "axios";
import { api } from "../api/api";
import type { ResponseDto } from "../models/AuthModel/authModel";
import type { FullCustomerInfor } from "../models/CustomerModels/FullCustomerInfor";
import type { PageResultDto } from "../models/PageResult/PageResultDto";
import { handleError } from "../utils/errorHandler";
import { ERROR_MESSAGE } from "../constants/messages/Message";

export async function getAllCustomerInformation(keyword: string, pageSize: number, pageIndex: number) {
  try {
    const response = await api.get<ResponseDto<PageResultDto<FullCustomerInfor>>>("/api/Customer", {
      params: {
        keyword: keyword,
        pageSize: pageSize,
        pageIndex: pageIndex,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function banAccount(accountId: number) {
  try {
    await api.delete(`/api/Account/${accountId}`);
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message || ERROR_MESSAGE.FAILED_TO_BANNED_ACCOUNT;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.FAILED_TO_BANNED_ACCOUNT);
  }
}
