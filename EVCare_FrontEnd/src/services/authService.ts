import axios from "axios";
import { api } from "../api/api";
import type {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  ResetPasswordRequestDto,
  ResponseDto,
  VerifyOtpSignUp,
} from "../models/AuthModel/authModel";
import { clearToken, setTokens } from "../token/tokenStore";
import { handleError } from "../utils/errorHandler";
import { store } from "../states/store";
import { setGlobalError } from "../states/errorSlice";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import type { AccountViewModel } from "../models/Accounts/accountViewModel";
import { useQuery } from "@tanstack/react-query";

// login
export async function login(loginData: LoginRequestDto) {
  try {
    const response = await api.post<ResponseDto<LoginResponseDto>>(
      "/api/Auth/login",
      loginData
    );
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || ERROR_MESSAGE.LOGIN_FAILED;
      store.dispatch(setGlobalError(errMsg));
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export function saveTokens(accessToken: string) {
  setTokens(accessToken);
}

// logout
export async function logout() {
  try {
    const response = await api.post<ResponseDto<null>>("/api/Auth/logout");
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || "Logout Failed";
      store.dispatch(setGlobalError(errMsg));
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export function deleteToken() {
  clearToken();
}

// signUp
export async function register(registerData: RegisterRequestDto) {
  try {
    const response = await api.post<ResponseDto<object>>(
      "/api/Auth/register",
      registerData
    );
    return response.data.message;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || "Register Failed";
      store.dispatch(setGlobalError(errMsg));
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export async function verifyOtp(data: VerifyOtpSignUp) {
  try {
    const response = await api.post<ResponseDto<object>>(
      "/api/Auth/verify-otp-register",
      data
    );
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || ERROR_MESSAGE.OTP_WRONG;
      store.dispatch(setGlobalError(errMsg));
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

//refresh
export async function refreshToken() {
  try {
    const response = await api.post<ResponseDto<object>>("/api/Auth/refresh");
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// forgot-password
export async function sendOtp(email: string) {
  try {
    const response = await api.post<ResponseDto<object>>(
      "/api/Auth/sent-otp",
      null,
      { params: { email } }
    );

    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg =
        error.response?.data.message || ERROR_MESSAGE.SOME_THING_WENT_WRONG;

      store.dispatch(setGlobalError(errMsg));
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}
export async function resetPassword(data: ResetPasswordRequestDto) {
  try {
    const response = await api.post<ResponseDto<object>>(
      "/api/Auth/reset-password",
      data
    );
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg =
        error.response?.data.message || ERROR_MESSAGE.RESET_PASSWORD_FAILED;

      store.dispatch(setGlobalError(errMsg));
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

// login with google
export async function loginWithGoogle(idToken: string | undefined) {
  try {
    const response = await api.post<ResponseDto<LoginResponseDto>>(
      "/api/Auth/login-google",
      idToken
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// get me
export async function getMe() {
  try {
    const response = await api.get<ResponseDto<AccountViewModel>>(
      "/api/Account/me"
    );
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.message;
      store.dispatch(setGlobalError(errMsg));
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export const useGetAccount = () => {
  return useQuery({
    queryKey: ["Account"],
    queryFn: async () => {
      try {
        const response = await api.get<ResponseDto<AccountViewModel>>(
          "/api/Account/me"
        );
        return response.data;
      } catch (error) {
        handleError(error);
        if (axios.isAxiosError(error)) {
          const errMsg = error.message;
          store.dispatch(setGlobalError(errMsg));
          throw new Error(errMsg);
        }
        throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      }
    },
  });
};
