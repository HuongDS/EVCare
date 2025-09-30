import { api } from "../api/api";
import type {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  ResetPasswordRequestDto,
  ResponseDto,
  VerifyOTPDto,
} from "../models/AuthModel/authModel";
import { clearToken, setTokens } from "../token/tokenStore";
import { handleError } from "../utils/errorHandler";

// login
export async function login(loginData: LoginRequestDto) {

  try {
    const response = await api.post<ResponseDto<LoginResponseDto>>("/api/Auth/login", loginData);
    return response.data;
  } catch (error) {
    handleError(error);
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
  }
}

export function deleteToken() {
  clearToken();
}

// signUp
export async function register(registerData: RegisterRequestDto) {
  await api.post<ResponseDto<object>>("/api/Auth/register", registerData);
}

export async function verifyOtp(data: VerifyOTPDto) {

  try {
    const response = await api.post<ResponseDto<object>>("/api/Auth/verify-otp-register", data);
    return response.data;
  } catch (error) {
    handleError(error);
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
    const response = await api.post<ResponseDto<object>>("/api/Auth/sent-otp", email);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}
export async function resetPassword(data: ResetPasswordRequestDto) {
  try {
    const response = await api.post<ResponseDto<object>>("/api/Auth/reset-password", data);
    return response.data;
  } catch (error) {
    handleError(error);
  }

}

// login with google
export async function loginWithGoogle(idToken: string | undefined) {

  try {
    const response = await api.post<ResponseDto<LoginResponseDto>>("/api/Auth/login-google", idToken);
    return response.data;
  } catch (error) {
    handleError(error);
  }

}
