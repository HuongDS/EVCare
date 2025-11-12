import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import * as authService from "../../../services/authService";
import * as tokenStore from "../../../token/tokenStore";
import * as jwtDecode from "../../../token/jwtDecode";
import { loginSuccess } from "../../../states/authSlice";
import { useNotification } from "../../../context/useNotification";
import { closeLogin, openAppointmentForm } from "../../../states/uiSlice";
import { RoleEnum } from "../../../models/enums";
import { useAuthentication } from "../../../hooks/useAuthentication";
import { AUTH_FORM_MESSAGE, ERROR_MESSAGE } from "../../../constants/messages/Message";
import HTTP_STATUS from "../../../constants/Code/HttpStatusCode";
import { ACTION } from "../../../constants/messages/Actions";
import type { User } from "../../../models/AuthModel/authModel";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));
vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}));
vi.mock("../../../context/useNotification.ts", () => ({
  useNotification: vi.fn(),
}));
vi.mock("../../../services/authService.ts", () => ({
  login: vi.fn(),
  register: vi.fn(),
  resetPassword: vi.fn(),
  saveTokens: vi.fn(),
  sendOtp: vi.fn(),
  verifyOtp: vi.fn(),
}));
vi.mock("../../../token/tokenStore.ts", () => ({
  saveUser: vi.fn(),
}));
vi.mock("../../../token/jwtDecode", () => ({
  toUseFromJwt: vi.fn(),
}));
vi.mock("../../../states/uiSlice.ts", () => ({
  default: {},
  closeLogin: vi.fn(() => ({ type: "ui/closeLogin", payload: undefined })),
  consumeAction: vi.fn(() => ({ type: "ui/consumeAction", payload: undefined })),
  openAppointmentForm: vi.fn(() => ({
    type: "ui/openAppointmentForm",
    payload: undefined,
  })),
}));

const mockedUseDispatch = vi.mocked(useDispatch);
const mockedUseSelector = vi.mocked(useSelector);
const mockedUseNavigate = vi.mocked(useNavigate);
const mockedUseNotification = vi.mocked(useNotification);
const mockedLogin = vi.mocked(authService.login);
const mockedRegister = vi.mocked(authService.register);
const mockedSendOtp = vi.mocked(authService.sendOtp);
const mockedVerifyOtp = vi.mocked(authService.verifyOtp);
const mockedResetPassword = vi.mocked(authService.resetPassword);
const mockedSaveTokens = vi.mocked(authService.saveTokens);
const mockedSaveUser = vi.mocked(tokenStore.saveUser);
const mockedToUseFromJwt = vi.mocked(jwtDecode.toUseFromJwt);

const mockDispatch = vi.fn();
const mockNavigate = vi.fn();
const mockNotification = {
  error: vi.fn(),
  success: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
  open: vi.fn(),
  destroy: vi.fn(),
};

const mockUser: User = {
  role: RoleEnum.ADMIN,
  email: "admin@evcare.com",
  accountId: 1,
};

describe("useAuthentication Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseDispatch.mockReturnValue(mockDispatch);
    mockedUseNavigate.mockReturnValue(mockNavigate);
    mockedUseNotification.mockReturnValue(mockNotification);
    mockedUseSelector.mockImplementation((selector) => {
      const mockState = {
        ui: {
          actionAfterLogin: null,
          loginFormOpen: true,
        },
      };
      return selector(mockState as any);
    });
    mockedToUseFromJwt.mockReturnValue(mockUser);
  });

  describe("handleLogin", () => {
    it("TC01: should show email error if email is invalid", async () => {
      // ARRANGE
      const { result } = renderHook(() => useAuthentication());
      act(() => {
        result.current.setEmail("bad-email");
        result.current.setPassword("ValidPass123!");
      });
      // ACT
      await act(async () => {
        await result.current.handleLogin();
      });
      // ASSERT
      expect(mockedLogin).not.toHaveBeenCalled();
      expect(mockNotification.error).toHaveBeenCalledWith(
        expect.objectContaining({
          description: ERROR_MESSAGE.INVALID_EMAIL,
        })
      );
      expect(result.current.isLoading).toBe(false);
    });

    it("TC02: should show password error if password is invalid", async () => {
      // ARRANGE
      const { result } = renderHook(() => useAuthentication());
      act(() => {
        result.current.setEmail("good@email.com");
        result.current.setPassword("bad");
      });
      // ACT
      await act(async () => {
        await result.current.handleLogin();
      });
      // ASSERT
      expect(mockedLogin).not.toHaveBeenCalled();
      expect(mockNotification.error).toHaveBeenCalledWith(
        expect.objectContaining({
          description: ERROR_MESSAGE.INVALID_PASSWORD,
        })
      );
    });

    it("TC03 [Happy Path]: should login, save token, navigate, and dispatch actions on success", async () => {
      // ARRANGE
      mockedLogin.mockResolvedValue({
        statusCode: HTTP_STATUS.OK,
        message: "Login Success",
        data: { accessToken: "fake.token.here" },
      });
      const { result } = renderHook(() => useAuthentication());
      act(() => {
        result.current.setEmail("admin@evcare.com");
        result.current.setPassword("Admin123!");
      });
      // ACT
      await act(async () => {
        await result.current.handleLogin();
      });
      // ASSERT
      expect(mockedLogin).toHaveBeenCalledWith({
        email: "admin@evcare.com",
        password: "Admin123!",
      });
      expect(mockedSaveTokens).toHaveBeenCalledWith("fake.token.here");
      expect(mockedToUseFromJwt).toHaveBeenCalledWith("fake.token.here");
      expect(mockedSaveUser).toHaveBeenCalledWith(mockUser);
      expect(mockNotification.success).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/admin/general");
      expect(mockDispatch).toHaveBeenCalledWith(loginSuccess(mockUser));
      expect(mockDispatch).toHaveBeenCalledWith(closeLogin());
      expect(result.current.isLoading).toBe(false);
      expect(result.current.email).toBe("");
    });

    it("TC04 [Happy Path BVA]: should dispatch openAppointmentForm if pending action exists", async () => {
      // ARRANGE
      mockedUseSelector.mockImplementation((selector) => {
        const mockState = {
          ui: {
            actionAfterLogin: ACTION.OPEN_APPOINTMENT,
          },
        };
        return selector(mockState as any);
      });
      mockedLogin.mockResolvedValue({
        statusCode: HTTP_STATUS.OK,
        data: { accessToken: "fake.token.here" },
      } as any);
      const { result } = renderHook(() => useAuthentication());
      act(() => {
        result.current.setEmail("user@evcare.com");
        result.current.setPassword("User123!");
      });
      // ACT
      await act(async () => {
        await result.current.handleLogin();
      });
      // ASSERT
      expect(mockDispatch).toHaveBeenCalledWith(openAppointmentForm());
    });
  });

  describe("handleSignUp", () => {
    it("TC05: should show warning on password mismatch", async () => {
      // ARRANGE
      const { result } = renderHook(() => useAuthentication());
      act(() => {
        result.current.setFirstName("Test");
        result.current.setLastName("User");
        result.current.setEmail("test@user.com");
        result.current.setPhone("0909090909");
        result.current.setPassword("ValidPass123!");
        result.current.setConfirm("WrongPass123!");
      });
      // ACT
      await act(async () => {
        await result.current.handleSignUp();
      });
      // ASSERT
      expect(mockedRegister).not.toHaveBeenCalled();
      expect(mockNotification.warning).toHaveBeenCalledWith(
        expect.objectContaining({
          description: ERROR_MESSAGE.PASSWORD_AND_CONFIRM_PASSWORD_MUST_BE_SAME,
        })
      );
    });

    it("TC06 [Happy Path]: should call register and set OTP screen on success", async () => {
      // ARRANGE
      mockedRegister.mockResolvedValue({
        statusCode: HTTP_STATUS.OK,
        message: "Success",
      } as any);
      const { result } = renderHook(() => useAuthentication());
      act(() => {
        result.current.setFirstName("Test");
        result.current.setLastName("User");
        result.current.setEmail("test@user.com");
        result.current.setPhone("0909090909");
        result.current.setPassword("ValidPass123!");
        result.current.setConfirm("ValidPass123!");
      });
      // ACT
      await act(async () => {
        await result.current.handleSignUp();
      });
      // ASSERT
      expect(mockedRegister).toHaveBeenCalledTimes(1);
      expect(mockNotification.error).not.toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isOTP).toBe(true);
      expect(result.current.firstName).toBe("");
    });

    it("TC07 [Error Path]: should show error if register API fails", async () => {
      // ARRANGE
      const apiError = new Error("Email already exists");
      mockedRegister.mockRejectedValue(apiError);
      const { result } = renderHook(() => useAuthentication());
      act(() => {
        result.current.setFirstName("Test");
        result.current.setLastName("User");
        result.current.setEmail("test@user.com");
        result.current.setPhone("0909090909");
        result.current.setPassword("ValidPass123!");
        result.current.setConfirm("ValidPass123!");
      });
      // ACT
      await act(async () => {
        await result.current.handleSignUp();
      });
      // ASSERT
      expect(mockedRegister).toHaveBeenCalled();
      expect(result.current.isOTP).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(mockNotification.error).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Email already exists",
        })
      );
    });

    it("TC14: handleSignUp - should show warning for invalid phone number", async () => {
      // ARRANGE
      const { result } = renderHook(() => useAuthentication());
      act(() => {
        result.current.setFirstName("Test");
        result.current.setLastName("User");
        result.current.setEmail("test@user.com");
        result.current.setPhone("123");
        result.current.setPassword("ValidPass123!");
        result.current.setConfirm("ValidPass123!");
      });
      // ACT
      await act(async () => {
        await result.current.handleSignUp();
      });
      // ASSERT
      expect(mockedRegister).not.toHaveBeenCalled();
      expect(mockNotification.warning).toHaveBeenCalledWith(
        expect.objectContaining({
          description: ERROR_MESSAGE.INVALID_PHONE,
        })
      );
    });
  });

  describe("handleVerifyOTP (SignUp)", () => {
    it("TC08: should show warning for invalid OTP format", async () => {
      // ARRANGE
      const { result } = renderHook(() => useAuthentication());
      act(() => {
        result.current.setOtp(["1", "2", "3", "4", "", ""]);
      });
      // ACT
      await act(async () => {
        await result.current.handleVerifyOTP();
      });

      // ASSERT
      expect(mockedVerifyOtp).not.toHaveBeenCalled();
      expect(mockNotification.warning).toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
    });

    it("TC09 [Happy Path]: should call verifyOtp and close OTP screen", async () => {
      // ARRANGE
      mockedVerifyOtp.mockResolvedValue({
        statusCode: HTTP_STATUS.OK,
        message: "Success",
      } as any);
      const { result } = renderHook(() => useAuthentication());
      act(() => {
        result.current.setEmail("test@user.com");
        result.current.setOtp(["1", "2", "3", "4", "5", "6"]);
        result.current.setIsOTP(true);
      });
      // ACT
      await act(async () => {
        await result.current.handleVerifyOTP();
      });
      // ASSERT
      expect(mockedVerifyOtp).toHaveBeenCalledWith({
        email: "test@user.com",
        otp: "123456",
      });
      expect(mockNotification.success).toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("Forgot Password Flow", () => {
    it("TC10 [Happy Path]: handChangeIsForgot should send OTP and set state", async () => {
      // ARRANGE
      mockedSendOtp.mockResolvedValue({
        statusCode: HTTP_STATUS.OK,
        message: "OTP sent",
      } as any);
      const { result } = renderHook(() => useAuthentication());
      act(() => {
        result.current.setEmail("forgot@pass.com");
      });
      // ACT
      await act(async () => {
        await result.current.handChangeIsForgot();
      });
      // ASSERT
      expect(mockedSendOtp).toHaveBeenCalledWith("forgot@pass.com");
      expect(mockNotification.success).toHaveBeenCalled();
      expect(result.current.isForgot).toBe(true);
      expect(result.current.isReset).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
    it("TC11 [Happy Path]: handleSubmitResetPassword should reset password", async () => {
      // ARRANGE
      mockedResetPassword.mockResolvedValue({
        statusCode: HTTP_STATUS.OK,
        message: "Password reset",
      } as any);
      const { result } = renderHook(() => useAuthentication());
      act(() => {
        result.current.setEmail("forgot@pass.com");
        result.current.setIsForgot(true);
        result.current.setIsReset(true);
        result.current.setIsOTP(true);
      });
      const formData = {
        newPassword: "NewValidPass123!",
        confirmNewPassword: "NewValidPass123!",
      };
      // ACT
      await act(async () => {
        await result.current.handleSubmitResetPassword(formData, "123456");
      });
      // ASSERT
      expect(mockedResetPassword).toHaveBeenCalled();
      expect(mockNotification.success).toHaveBeenCalled();
      expect(result.current.isForgot).toBe(false);
      expect(result.current.isReset).toBe(false);
      expect(result.current.isOTP).toBe(false);
      expect(mockDispatch).toHaveBeenCalledWith(closeLogin());
    });

    it("TC12: handleSubmitResetPassword should show warning on password mismatch", async () => {
      // ARRANGE
      const { result } = renderHook(() => useAuthentication());
      const formData = {
        newPassword: "NewValidPass123!",
        confirmNewPassword: "MISMATCH!",
      };
      // ACT
      await act(async () => {
        await result.current.handleSubmitResetPassword(formData, "123456");
      });
      // ASSERT
      expect(mockedResetPassword).not.toHaveBeenCalled();
      expect(mockNotification.warning).toHaveBeenCalledWith(
        expect.objectContaining({
          message: ERROR_MESSAGE.PASSWORD_AND_CONFIRM_PASSWORD_MUST_BE_SAME,
        })
      );
      expect(result.current.isLoading).toBe(false);
    });

    it("TC13: handChangeIsForgot - should show warning and reset flags if email is invalid", async () => {
      // ARRANGE
      const { result } = renderHook(() => useAuthentication());
      act(() => {
        result.current.setEmail("bad-email");
      });

      // ACT
      await act(async () => {
        await result.current.handChangeIsForgot();
      });

      // ASSERT
      expect(mockedSendOtp).not.toHaveBeenCalled();
      expect(mockNotification.warning).toHaveBeenCalledWith(
        expect.objectContaining({ message: ERROR_MESSAGE.INVALID_EMAIL })
      );
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isForgot).toBe(false);
    });
  });

  describe("headerText (useMemo)", () => {
    it("TC15: should return correct header text based on state", () => {
      // ARRANGE
      const { result, rerender } = renderHook(() => useAuthentication());
      // ASSERT
      expect(result.current.headerText).toBe(AUTH_FORM_MESSAGE.REGISTER);
      // ACT
      act(() => result.current.setIsSignUp(false));
      rerender();
      // ASSERT
      expect(result.current.headerText).toBe(AUTH_FORM_MESSAGE.LOGIN);
      // ACT
      act(() => result.current.setIsForgot(true));
      rerender();
      // ASSERT
      expect(result.current.headerText).toBe("");
      // ACT
      act(() => result.current.setIsOTP(true));
      rerender();
      // ASSERT
      expect(result.current.headerText).toBe("");
    });
  });
});
