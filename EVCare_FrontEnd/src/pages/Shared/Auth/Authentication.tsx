import { useCallback, useMemo, useState } from "react";
import logo from "../../../assets/EVCare.png";
import SwitchButton from "../../../components/SwitchButton/SwitchButton";
import { StyledModal, SideImage, FormContainer, HeaderBox } from "./Authentication.styled";
import AuthForm from "./sections/AuthForm";
import OTPForm from "./sections/OTPForm";
import { AUTH_FORM_MESSAGE, ERROR_MESSAGE, SUCCESS_MESSAGE } from "../../../constants/messages/Message";
import type { LoginRequestDto, RegisterRequestDto, VerifyOTPDto } from "../../../models/AuthModel/authModel";
import { login, register, saveTokens, verifyOtp } from "../../../services/authService";
import HTTP_STATUS from "../../../constants/Code/HttpStatusCode";
import { decodeJwt } from "../../../token/jwtDecode";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../states/store";
import { loginSuccess } from "../../../states/authSlice";
import type { User } from "../../../models/AuthModel/authModel";
import { LENGTH } from "../../../constants/Code/Constants";
import { OTP_REGEX } from "../../../constants/regexs/OTPRegex";
import { saveUser } from "../../../token/tokenStore";

interface AuthProps {
  show: boolean;
  handleClose: () => void;
}

export default function Authentication({ show, handleClose }: AuthProps) {
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

  // login
  const handleLogin = useCallback(async () => {
    const loginData: LoginRequestDto = {
      email: email,
      password: password,
    };
    try {
      const response = await login(loginData);
      if (response.statusCode != HTTP_STATUS.OK) {
        throw new Error(ERROR_MESSAGE.LOGIN_FAILED);
      }
      const token = response.data?.accessToken;
      if (!token) {
        throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      }
      saveTokens(token);
      const payload = decodeJwt(token);
      const user: User = {
        accountId: Number(payload.nameid),
        email: payload.email,
        role: payload.role,
      };
      saveUser(user);
      dispatch(loginSuccess(user));
      alert("Success");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Login error:", err.message);
      } else {
        console.error("Login error:", err);
      }
    }
  }, [email, password, dispatch]);

  const handleSignUp = useCallback(async () => {
    if (password !== confirm) {
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
      if (response.statusCode != HTTP_STATUS.CREATED) {
        throw new Error(ERROR_MESSAGE.OTP_WRONG);
      }
    } catch (error) {
      console.log(error);
    }
    alert(SUCCESS_MESSAGE.REGISTER_SUCCESS);
    setIsOTP(false);
    handleClose();
  }, [email, otp, handleClose]);

  // header text
  const headerText = useMemo(
    () => (isOTP ? AUTH_FORM_MESSAGE.VERIFY : isSignUp ? AUTH_FORM_MESSAGE.REGISTER : AUTH_FORM_MESSAGE.WELCOME_BACK),
    [isOTP, isSignUp]
  );

  return (
    <StyledModal show={show} onHide={handleClose} centered>
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
