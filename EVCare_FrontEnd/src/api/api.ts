import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { clearToken, getAccessToken } from "../token/tokenStore";
import type { LoginResponseDto, ResponseDto } from "../models/AuthModel/authModel";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import { saveTokens } from "../services/authService";
import { store } from "../states/store";
import { logoutRedux } from "../states/authSlice";
import { handleError } from "../utils/errorHandler";
import { setGlobalError } from "../states/errorSlice";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type RetryConfig = AxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig;
    if (
      original?.url?.includes("/api/Auth/login") ||
      original?.url?.includes("/api/Auth/refresh") ||
      original?.url?.includes("/api/Auth/verify-otp-register") ||
      original?.url?.includes("/api/Auth/register")
    ) {
      return Promise.reject(error);
    }
    if (error?.response?.status === 401 && !original?.headers?.Authorization) {
      return Promise.reject(error);
    }
    if (error?.response?.status === 401 && !original?._retry) {
      original._retry = true;
      try {
        const response = await api.post<ResponseDto<LoginResponseDto>>(
          `${import.meta.env.VITE_API_BASE}/api/Auth/refresh`
        );
        const newToken = response.data.data?.accessToken;
        if (!newToken) throw new Error(ERROR_MESSAGE.NO_ACCESS_TOKEN_FROM_REFRESH);
        clearToken();
        saveTokens(newToken);
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (error) {
        store.dispatch(logoutRedux());
        clearToken();
        window.location.href = "/";
        handleError(error);
        store.dispatch(setGlobalError(error instanceof Error ? error.message : ERROR_MESSAGE.SOME_THING_WENT_WRONG));
      }
    }
    return Promise.reject(error);
  }
);
