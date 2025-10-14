import { useCallback, useMemo, useState } from "react";
import logo from "../../../assets/EVCare.png";
import SwitchButton from "../../../components/Button/SwitchButton";
import { FormContainer, HeaderBox, SideImage, StyledModal } from "./Authentication.styled";
import AuthForm from "./sections/AuthForm";
import OTPForm from "./sections/OTPForm";
import { AUTH_FORM_MESSAGE, ERROR_MESSAGE, MSG_TITLE } from "../../../constants/messages/Message";
import type { LoginRequestDto, RegisterRequestDto, VerifyOTPDto } from "../../../models/AuthModel/authModel";
import { login, register, saveTokens, sendOtp, verifyOtp } from "../../../services/authService";
import { toUseFromJwt } from "../../../token/jwtDecode";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../states/store";
import { loginSuccess } from "../../../states/authSlice";
import { LENGTH } from "../../../constants/Code/Constants";
import { OTP_REGEX } from "../../../constants/regexs/OTPRegex";
import { saveUser } from "../../../token/tokenStore";
import { PASSWORD_REGEX } from "../../../constants/regexs/PasswordRegex";
import { EMAIL_REGEX } from "../../../constants/regexs/EmailRegex";
import { PHONE_NUMBER_REGEX } from "../../../constants/regexs/PhoneNumberRegex";
import { closeLogin, consumeAction, openAppointmentForm } from "../../../states/uiSlice";
import { ACTION } from "../../../constants/messages/Actions";
import HTTP_STATUS from "../../../constants/Code/HttpStatusCode";
import { handleError } from "../../../utils/errorHandler";
import ForgotPassword from "./sections/ForgotPassword";
import { RoleEnum } from "../../../models/enums";
import { useNavigate } from "react-router";
import { useNotification } from "../../../context/useNotification";

// interface AuthProps {
//   show: boolean;
//   handleClose: () => void;
// }

export default function Authentication() {
  const [isSignUp, setIsSignUp] = useState(true); // true: signUp | false : login
  const [isOTP, setIsOTP] = useState(false); // true: verify Otp

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(() => Array(LENGTH.OTP_LENGTH).fill("")); // lazy init
  const [isLoading, setIsLoading] = useState(false);
  const [isForgot, setIsForgot] = useState(false);

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
      alert(err);
      notification.error({
        message: MSG_TITLE.LOGIN,
        description: err as string,
        showProgress: true,
      });
      setIsLoading(false);
      return;
    }
  }, [email, password, pending, dispatch, navigate, notification]);

  const handleSignUp = useCallback(async () => {
    if (firstName == null || lastName == null || firstName.length == 0 || lastName.length == 0) {
      alert(ERROR_MESSAGE.THIS_FIELD_IS_REQUIRED);
      return;
    } else if (firstName.trim().length == 0 || lastName.trim().length == 0) {
      console.log(firstName);
      console.log(lastName);

      alert(ERROR_MESSAGE.THIS_FIELD_NOT_VALID);
      return;
    } else if (!EMAIL_REGEX.test(email)) {
      alert(ERROR_MESSAGE.INVALID_EMAIL);
      return;
    } else if (!PASSWORD_REGEX.test(password) || !PASSWORD_REGEX.test(confirm)) {
      alert(ERROR_MESSAGE.INVALID_PASSWORD);
      return;
    } else if (!PHONE_NUMBER_REGEX.test(phone)) {
      alert(ERROR_MESSAGE.INVALID_PHONE);
      return;
    } else if (password !== confirm) {
      alert(ERROR_MESSAGE.PASSWORD_AND_CONFIRM_PASSWORD_MUST_BE_SAME);
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
      alert(error instanceof Error ? error.message : ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      handleError(error);
      setIsLoading(false);
      return;
    }
  }, [email, password, firstName, lastName, phone, confirm]);

  const handleVerifyOTP = useCallback(async () => {
    setIsLoading(true);
    const code = otp.join("");
    if (code.length != LENGTH.OTP_LENGTH || !OTP_REGEX.test(code)) {
      alert(`OTP must be ${LENGTH.OTP_LENGTH} numbers`);
      return;
    }
    try {
      const data: VerifyOTPDto = {
        email: email,
        otp: code,
      };
      const response = await verifyOtp(data);
      alert(response.message);
    } catch (error) {
      alert(error);
      setIsLoading(false);
      handleError(error);
      return;
    }
    setIsLoading(false);
    setIsOTP(false);
    dispatch(closeLogin());
  }, [email, otp, dispatch]);

  const handChangeIsForgot = useCallback(async () => {
    setIsLoading(true);
    setIsForgot(true);
    try {
      if (!EMAIL_REGEX.test(email.trim())) {
        alert(ERROR_MESSAGE.INVALID_EMAIL);
        return;
      }
      const response = await sendOtp(email);
      console.log(response);
    } catch (error) {
      alert(error);
      handleError(error);
      return;
    } finally {
      setIsLoading(false);
      setIsForgot(false);
    }
  }, [email]);

  // header text
  const headerText = useMemo(() => {
    if (isOTP) return AUTH_FORM_MESSAGE.VERIFY;
    if (isSignUp) return AUTH_FORM_MESSAGE.REGISTER;
    if (isForgot) return AUTH_FORM_MESSAGE.FORGOT_PASSWORD;
    return AUTH_FORM_MESSAGE.LOGIN;
  }, [isOTP, isSignUp, isForgot]);

  return (
    <StyledModal show={loginFormOpen} onHide={() => dispatch(closeLogin())} centered>
      <SideImage $isSignUp={isSignUp}>
        <img src={logo} alt="EVCare Logo" />
      </SideImage>
      <FormContainer $isSignUp={isSignUp}>
        <HeaderBox>
          <h1>{headerText}</h1>
          {!isOTP && !isForgot ? <SwitchButton isSignUp={isSignUp} onChange={setIsSignUp} /> : null}
        </HeaderBox>

        {!isOTP ? (
          <>
            {isForgot ? (
              <ForgotPassword
                isLoading={isLoading}
                handChangeIsForgot={handChangeIsForgot}
                email={email}
                setEmail={setEmail}
              />
            ) : (
              <AuthForm
                isSignUp={isSignUp}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirm={confirm}
                setConfirm={setConfirm}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                phone={phone}
                setPhone={setPhone}
                handleSignUp={handleSignUp}
                handleLogin={handleLogin}
                isForgot={isForgot}
                setIsForgot={setIsForgot}
                disable={isLoading}
              />
            )}
          </>
        ) : (
          <OTPForm disable={isLoading} otp={otp} setOtp={setOtp} handleVerifyOTP={handleVerifyOTP} />
        )}
      </FormContainer>
    </StyledModal>
  );
}
