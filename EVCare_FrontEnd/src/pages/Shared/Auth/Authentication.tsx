import { useCallback, useMemo, useState } from "react";
import logo from "../../../assets/EVCare.png";
import SwitchButton from "../../../components/SwitchButton/SwitchButton";
import { StyledModal, SideImage, FormContainer, HeaderBox } from "./Authentication.styled";
import AuthForm from "./sections/AuthForm";
import OTPForm from "./sections/OTPForm";
import { AUTH_FORM_MESSAGE, ERROR_MESSAGE, SUCCESS_MESSAGE } from "../../../constants/messages/Message";
import type { LoginRequestDto, RegisterRequestDto, VerifyOTPDto } from "../../../models/AuthModel/authModel";
import { login, register, saveTokens, verifyOtp } from "../../../services/authService";
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

  // Redux
  const dispatch = useDispatch<AppDispatch>();
  const pending = useSelector((state: RootState) => state.ui.actionAfterLogin);
  const loginFormOpen = useSelector((state: RootState) => state.ui.loginFormOpen);

  // login
  const handleLogin = useCallback(async () => {
    const loginData: LoginRequestDto = {
      email: email,
      password: password,
    };
    try {
      if (!EMAIL_REGEX.test(email)) {
        alert(ERROR_MESSAGE.INVALID_EMAIL);
        return;
      } else if (!PASSWORD_REGEX.test(password)) {
        alert(ERROR_MESSAGE.INVALID_PASSWORD);
        return;
      }
      const response = await login(loginData);
      const token = response.data?.accessToken;
      if (!token) {
        throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      }
      saveTokens(token);
      const user = toUseFromJwt(token);
      saveUser(user);
      dispatch(loginSuccess(user));
      dispatch(closeLogin());
      setEmail("");
      setPassword("");
      if (pending === ACTION.OPEN_APPOINTMENT) {
        dispatch(openAppointmentForm());
      }
      dispatch(consumeAction());
      alert("Success");
    } catch (err) {
      alert(ERROR_MESSAGE.LOGIN_FAILED);
      console.log("Error in login: " + err);
    }
  }, [email, password, pending, dispatch]);

  const handleSignUp = useCallback(async () => {
    if (firstName.length == 0 || lastName.length == 0) {
      alert(ERROR_MESSAGE.THIS_FIELD_IS_REQUIRED);
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
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
    };
    await register(registerData);
    setFirstName("");
    setLastName("");
    setPassword("");
    setConfirm("");
    setPhone("");
    setIsOTP(true);
  }, [email, password, firstName, lastName, phone, confirm]);

  const handleVerifyOTP = useCallback(async () => {
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
      if (response.statusCode != HTTP_STATUS.OK) {
        alert(ERROR_MESSAGE.OTP_WRONG);
        return;
      }
    } catch (error) {
      alert(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      console.log(error);
    }
    alert(SUCCESS_MESSAGE.REGISTER_SUCCESS);
    setIsOTP(false);
    dispatch(closeLogin());
  }, [email, otp, dispatch]);

  // header text
  const headerText = useMemo(
    () => (isOTP ? AUTH_FORM_MESSAGE.VERIFY : isSignUp ? AUTH_FORM_MESSAGE.REGISTER : AUTH_FORM_MESSAGE.WELCOME_BACK),
    [isOTP, isSignUp]
  );

  return (
    <StyledModal show={loginFormOpen} onHide={() => dispatch(closeLogin())} centered>
      <SideImage $isSignUp={isSignUp}>
        <img src={logo} alt="EVCare Logo" />
      </SideImage>
      <FormContainer $isSignUp={isSignUp}>
        <HeaderBox>
          <h1>{headerText}</h1>
          {!isOTP ? <SwitchButton isSignUp={isSignUp} onChange={setIsSignUp} /> : undefined}
        </HeaderBox>

        {!isOTP ? (
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
          />
        ) : (
          <OTPForm otp={otp} setOtp={setOtp} handleVerifyOTP={handleVerifyOTP} />
        )}
      </FormContainer>
    </StyledModal>
  );
}
