import type { RoleEnum } from "../enums";

export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export type LoginRequestDto = {
  email: string;
  password: string;
};

export type LoginResponseDto = {
  accessToken: string;
};

export type User = {
  email: string;
  role: RoleEnum;
};

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
};

export type JwtPayLoad = {
  email: string;
  role: RoleEnum;
  exp: number;
};

export type RegisterRequestDto = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
};

export type VerifyOTPDto = {
  email: string;
  otp: string;
};

export type ResetPasswordRequestDto = {
  email: string;
  newPassword: string;
  otp: string;
};
