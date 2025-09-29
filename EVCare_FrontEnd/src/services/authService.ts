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

// login
export async function login(loginData: LoginRequestDto) {
  const response = await api.post<ResponseDto<LoginResponseDto>>(
    "/api/Auth/login",
    loginData
  );
  return response.data;
}

export function saveTokens(accessToken: string) {
  setTokens(accessToken);
}

// logout
export async function logout() {
  const response = await api.post<ResponseDto<null>>("/api/Auth/logout");
  return response.data;
}

export function deleteToken() {
  clearToken();
}

// signUp
export async function register(registerData: RegisterRequestDto) {
  await api.post<ResponseDto<object>>("/api/Auth/register", registerData);
}

export async function verifyOtp(data: VerifyOTPDto) {
  const response = await api.post<ResponseDto<object>>(
    "/api/Auth/verify-otp-register",
    data
  );
  return response;
}

//refresh
export async function refreshToken() {
  const response = await api.post<ResponseDto<object>>("/api/Auth/refresh");
  return response.data;
}

// forgot-password
export async function sendOtp(email: string) {
  const response = await api.post<ResponseDto<object>>(
    "/api/Auth/sent-otp",
    email
  );
  return response.data;
}
export async function resetPassword(data: ResetPasswordRequestDto) {
  const response = await api.post<ResponseDto<object>>(
    "/api/Auth/reset-password",
    data
  );
  return response.data;
}

// login with google
export async function loginWithGoogle(idToken: string | undefined) {
  const response = await api.post<ResponseDto<LoginResponseDto>>(
    "/api/Auth/login-google",
    idToken
  );
  return response.data;
}
