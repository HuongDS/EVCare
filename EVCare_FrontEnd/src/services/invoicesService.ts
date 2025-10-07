import axios from "axios";
import { handleError } from "../utils/errorHandler";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import type { InvoiceViewModel } from "../models/Invoice/InvoiceViewModel";
import { api } from "../api/api";
import type { ResponseDto } from "../models/AuthModel/authModel";

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
