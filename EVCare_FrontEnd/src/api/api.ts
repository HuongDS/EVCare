import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { clearToken, getAccessToken } from "../token/tokenStore";
import type { LoginResponseDto, ResponseDto } from "../models/AuthModel/authModel";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import { saveTokens } from "../services/authService";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../states/store";
import { logoutRedux } from "../states/authSlice";

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
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const original = error.config as RetryConfig;
    if (error?.response?.status === 401 || !original?._retry) {
      original._retry = true;
      try {
        const response = await api.post<ResponseDto<LoginResponseDto>>(
          `${import.meta.env.VITE_API_BASE}/api/Auth/refresh`
        );
        const newToken = response.data.data?.accessToken;
        if (!newToken) throw new Error(ERROR_MESSAGE.NO_ACCESS_TOKEN_FROM_REFRESH);
        saveTokens(newToken);
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return axios(original);
      } catch (error) {
        dispatch(logoutRedux());
        clearToken();
        navigate("/");
        console.log(error);
      }
    }
  }
);
