import axios from "axios";
import { handleError } from "../utils/errorHandler";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import type { InvoiceViewModel } from "../models/Invoice/InvoiceViewModel";
import { api } from "../api/api";
import type { ResponseDto } from "../models/AuthModel/authModel";
import type { PageResultDto } from "../models/PageResult/PageResultDto";
import { useQuery } from "@tanstack/react-query";

export async function getInvoices() {
  try {
    const response = await api.get<ResponseDto<InvoiceViewModel[]>>("/api/Invoice/invoices");
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message || ERROR_MESSAGE.FETCH_DATA_FAILED;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export async function getRevenue(year: number, month: number) {
  try {
    const response = await api.get<ResponseDto<number>>(`/api/Invoice/get-revenue/${year}/${month}`);
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message || ERROR_MESSAGE.FETCH_DATA_FAILED;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export async function getInvoicesWithPagination(pageSize: number, pageIndex: number) {
  try {
    const response = await api.get<ResponseDto<PageResultDto<InvoiceViewModel>>>("/api/Invoice/get-recently-invoices", {
      params: {
        pageSize: pageSize,
        pageIndex: pageIndex,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message || ERROR_MESSAGE.FETCH_DATA_FAILED;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

//[STAFF] - Get invoice by order ID
export const useGetInvoice = (orderId: number) => {
  return useQuery({
    queryKey: ["Invoice", orderId],
    queryFn: async () => {
      try {
        const response = await api.get<ResponseDto<InvoiceViewModel>>(`/api/Invoice/by-order/${orderId}`);
        return response.data;
      } catch (error) {
        handleError(error);
        if (axios.isAxiosError(error)) {
          const errMsg = error.response?.data.message || error.message || ERROR_MESSAGE.FETCH_DATA_FAILED;
          throw new Error(errMsg);
        }
        throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      }
    },
    refetchOnWindowFocus: false,
  });
};

//[STAFF] - Download invoice pdf
export const useDownloadInvoice = (orderId: number) => {
  return useQuery({
    queryKey: ["DownloadInvoice", orderId],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/Invoice/${orderId}/print`, {
          responseType: "blob",
          headers: {
            Accept: "application/pdf",
          },
        });
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        return url;
      } catch (error) {
        handleError(error);
        if (axios.isAxiosError(error)) {
          const errMsg = error.response?.data.message || error.message || ERROR_MESSAGE.FETCH_DATA_FAILED;
          throw new Error(errMsg);
        }
        throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      }
    },
    enabled: false,
  });
};
