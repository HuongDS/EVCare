import axios from "axios";
import { api } from "../api/api";
import type { AccountViewModel } from "../models/Accounts/accountViewModel";
import { handleError } from "../utils/errorHandler";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import { store } from "../states/store";
import { setGlobalError } from "../states/errorSlice";
import type { ResponseDto } from "../models/AuthModel/authModel";
import type { AccountUpdateDto } from "../models/Accounts/AccountUpdateDto";

export async function getAccountInformation() {
  try {
    const response = await api.get<ResponseDto<AccountViewModel>>("/api/Account/me");
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || ERROR_MESSAGE.FETCH_DATA_FAILED;
      store.dispatch(setGlobalError(errMsg));
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.FETCH_DATA_FAILED);
  }
}

// export const useGetAccountInformation = () => {
//   return useQuery({
//     queryKey: ["Account Information"],
//     queryFn: () => getAccountInformation(),
//   });
// };

export async function updateAccount(data: AccountUpdateDto) {
  try {
    const response = await api.put<ResponseDto<AccountViewModel>>("/api/Account/update-me", data);
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message || ERROR_MESSAGE.FAILED_TO_UPDATE_ACCOUNT;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}
