import { useCallback, useMemo, useState } from "react";
import { AUTH_FORM_MESSAGE, ERROR_MESSAGE, FORM_MESSAGES, MSG_TITLE } from "../constants/messages/Message";
import { handleError } from "../utils/errorHandler";
import HTTP_STATUS from "../constants/Code/HttpStatusCode";
import { EMAIL_REGEX } from "../constants/regexs/EmailRegex";
import { closeLogin, consumeAction, openAppointmentForm } from "../states/uiSlice";
import { login, register, resetPassword, saveTokens, sendOtp, verifyOtp } from "../services/authService";
import type { LoginRequestDto, RegisterRequestDto, VerifyOTPDto, VerifyOtpSignUp } from "../models/AuthModel/authModel";
import { PASSWORD_REGEX } from "../constants/regexs/PasswordRegex";
import { LENGTH } from "../constants/Code/Constants";
import { OTP_REGEX } from "../constants/regexs/OTPRegex";
import { PHONE_NUMBER_REGEX } from "../constants/regexs/PhoneNumberRegex";
import { NAME_REGEX } from "../constants/regexs/NameRegex";
import { ACTION } from "../constants/messages/Actions";
import { loginSuccess } from "../states/authSlice";
import { RoleEnum } from "../models/enums";
import { saveUser } from "../token/tokenStore";
import { toUseFromJwt } from "../token/jwtDecode";
import { useNotification } from "../context/useNotification";
import { useNavigate } from "react-router";
import type { AppDispatch, RootState } from "../states/store";
import { useDispatch, useSelector } from "react-redux";

type FormDataResetPassword = {
  newPassword: string;
  confirmNewPassword: string;
};

export const useAuthentication = () => {
  const [isSignUp, setIsSignUp] = useState(true); // true: signUp | false : login
  const [isOTP, setIsOTP] = useState(false); // true: verify Otp

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(LENGTH.OTP_LENGTH).fill(""));

  // Redux
  const dispatch = useDispatch<AppDispatch>();
  const pending = useSelector((state: RootState) => state.ui.actionAfterLogin);
  const loginFormOpen = useSelector((state: RootState) => state.ui.loginFormOpen);

  // Navigate
  const navigate = useNavigate();

  // notification
  const notification = useNotification();

  // login
  const handleLogin = useCallback(async () => {
    setIsLoading(true);
    const loginData: LoginRequestDto = {
      email: email.trim(),
      password: password.trim(),
    };
    try {
      if (!EMAIL_REGEX.test(email)) {
        throw new Error(ERROR_MESSAGE.INVALID_EMAIL);
      } else if (!PASSWORD_REGEX.test(password)) {
        throw new Error(ERROR_MESSAGE.INVALID_PASSWORD);
      }
      const response = await login(loginData);
      if (response.statusCode !== HTTP_STATUS.OK) {
        throw new Error(ERROR_MESSAGE.LOGIN_FAILED);
      }
      const token = response.data?.accessToken;
      if (!token) {
        throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      }
      saveTokens(token);
      const user = toUseFromJwt(token);
      saveUser(user);

      notification.success({
        message: MSG_TITLE.LOGIN,
        description: response.message,
        showProgress: true,
      });

      // Author
      switch (user.role) {
        case RoleEnum.ADMIN:
          navigate("/admin/general");
          break;
        case RoleEnum.STAFF:
          navigate("/staff");
          break;
        case RoleEnum.TECHNICIAN:
          navigate("/technician");
          break;
      }

      dispatch(loginSuccess(user));
      dispatch(closeLogin());
      setEmail("");
      setPassword("");
      if (pending === ACTION.OPEN_APPOINTMENT) {
        dispatch(openAppointmentForm());
      }
      dispatch(consumeAction());
      setIsLoading(false);
      // alert(response.message);
    } catch (err) {
      notification.error({
        message: MSG_TITLE.LOGIN,
        description: (err as Error).message,
        showProgress: true,
      });
      setIsLoading(false);
      return;
    }
  }, [email, password, pending, dispatch, navigate, notification]);

  const handleSignUp = useCallback(async () => {
    if (firstName == null || lastName == null || firstName.length === 0 || lastName.length === 0) {
      notification.warning({
        message: "Error",
        description: FORM_MESSAGES.NAME,
        showProgress: true,
        duration: 3,
      });
      return;
    } else if (
      firstName.trim().length == 0 ||
      lastName.trim().length == 0 ||
      !NAME_REGEX.test(firstName) ||
      !NAME_REGEX.test(lastName)
    ) {
      notification.warning({
        message: "Error",
        description: FORM_MESSAGES.INVALID_NAME,
        showProgress: true,
        duration: 3,
      });
      return;
    } else if (!EMAIL_REGEX.test(email)) {
      notification.warning({
        message: "Error",
        description: ERROR_MESSAGE.INVALID_EMAIL,
        showProgress: true,
        duration: 3,
      });
      return;
    } else if (!PASSWORD_REGEX.test(password) || !PASSWORD_REGEX.test(confirm)) {
      notification.warning({
        message: "Error",
        description: ERROR_MESSAGE.INVALID_PASSWORD,
        showProgress: true,
        duration: 3,
      });
      return;
    } else if (!PHONE_NUMBER_REGEX.test(phone)) {
      notification.warning({
        message: "Error",
        description: ERROR_MESSAGE.INVALID_PHONE,
        showProgress: true,
        duration: 3,
      });
      return;
    } else if (password !== confirm) {
      notification.warning({
        message: "Error",
        description: ERROR_MESSAGE.PASSWORD_AND_CONFIRM_PASSWORD_MUST_BE_SAME,
        showProgress: true,
        duration: 3,
      });
      return;
    }
    const registerData: RegisterRequestDto = {
      email: email.trim(),
      password: password.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
    };
    setIsLoading(true);
    try {
      const response = await register(registerData);
      if (!response) {
        throw new Error(response);
      }
      setFirstName("");
      setLastName("");
      setPassword("");
      setConfirm("");
      setPhone("");
      setIsOTP(true);
      setIsLoading(false);
    } catch (error) {
      notification.error({
        message: (error as Error).message,
        showProgress: true,
      });
      handleError(error);
      setIsLoading(false);
      return;
    }
  }, [email, password, firstName, lastName, phone, confirm]);

  const handleSubmitResetPassword = useCallback(
    async (formData: FormDataResetPassword, otp: string) => {
      setIsLoading(true);
      if (otp.length != LENGTH.OTP_LENGTH || !OTP_REGEX.test(otp)) {
        notification.warning({
          message: `OTP must be ${LENGTH.OTP_LENGTH} numbers`,
          showProgress: true,
        });
        setIsLoading(false);
        return;
      }
      if (!PASSWORD_REGEX.test(formData.newPassword)) {
        notification.warning({
          message: ERROR_MESSAGE.INVALID_PASSWORD,
          showProgress: true,
        });
        setIsLoading(false);
        return;
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        notification.warning({
          message: ERROR_MESSAGE.PASSWORD_AND_CONFIRM_PASSWORD_MUST_BE_SAME,
          showProgress: true,
        });
        setIsLoading(false);
        return;
      }
      try {
        const data: VerifyOTPDto = {
          email: email,
          otp: otp,
          newPassword: formData.newPassword,
        };
        const response = await resetPassword(data);
        notification.success({ message: response.message });
        setIsForgot(false);
        setIsReset(false);
      } catch (error) {
        notification.error({
          message: (error as Error).message,
          showProgress: true,
        });
        setIsLoading(false);
        handleError(error);
        return;
      }
      setIsLoading(false);
      setIsOTP(false);
      dispatch(closeLogin());
    },
    [email, dispatch]
  );

  const handChangeIsForgot = useCallback(async () => {
    setIsLoading(true);
    setIsForgot(true);
    setIsReset(true);
    try {
      if (!EMAIL_REGEX.test(email.trim())) {
        notification.warning({ message: ERROR_MESSAGE.INVALID_EMAIL });
        setIsLoading(false);
        setIsForgot(false);
        return;
      }
      const response = await sendOtp(email);
      if (response.statusCode === HTTP_STATUS.OK) {
        notification.success({ message: response.message });
        // setIsOTP(true);
        // setIsForgot(false);
      }
    } catch (error) {
      notification.error({
        message: (error as Error).message,
        showProgress: true,
      });
      handleError(error);
      setIsForgot(false);
      return;
    } finally {
      setIsLoading(false);
    }
  }, [email, notification]);

  // header text
  const headerText = useMemo(() => {
    if (isOTP) return "";
    if (isSignUp) return AUTH_FORM_MESSAGE.REGISTER;
    if (isForgot) return "";
    return AUTH_FORM_MESSAGE.LOGIN;
  }, [isOTP, isSignUp, isForgot]);

  const handleVerifyOTP = useCallback(async () => {
    setIsLoading(true);
    const code = otp.join("");
    if (code.length != LENGTH.OTP_LENGTH || !OTP_REGEX.test(code)) {
      notification.warning({
        message: `OTP must be ${LENGTH.OTP_LENGTH} numbers`,
        showProgress: true,
      });
      setIsLoading(false);
      return;
    }
    try {
      const data: VerifyOtpSignUp = {
        email: email,
        otp: code,
      };
      const response = await verifyOtp(data);
      notification.success({ message: response.message });
      setIsLoading(false);
      setIsOTP(false);
    } catch (error) {
      notification.error({
        message: (error as Error).message,
        showProgress: true,
      });
      setIsLoading(false);
    }
  }, []);

  return {
    isSignUp,
    isOTP,
    email,
    password,
    confirm,
    firstName,
    lastName,
    phone,
    isLoading,
    isForgot,
    pending,
    isReset,
    otp,

    navigate,
    notification,
    dispatch,
    loginFormOpen,

    setIsSignUp,
    setIsOTP,
    setEmail,
    setPassword,
    setConfirm,
    setFirstName,
    setLastName,
    setPhone,
    setIsLoading,
    setIsForgot,
    setIsReset,
    setOtp,

    handleLogin,
    handleSignUp,
    handleSubmitResetPassword,
    handChangeIsForgot,
    headerText,
    handleVerifyOTP,
  };
};
