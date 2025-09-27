import { useState } from "react";
import logo from "../../../assets/EVCare.png";
import SwitchButton from "../../../components/SwitchButton/SwitchButton";
import {
  StyledModal,
  SideImage,
  FormContainer,
  HeaderBox,
} from "./Authentication.styled";
import AuthForm from "./sections/AuthForm";
import OTPForm from "./sections/OTPForm";
import {
  AUTH_FORM_MESSAGE,
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
} from "../../../constants/messages/Message";
import type { LoginRequestDto } from "../../../models/AuthModel/authModel";
import {
  login,
  saveTokens,
} from "../../../services/authService";
import HTTP_STATUS from "../../../constants/Code/HttpStatusCode";
import { decodeJwt } from "../../../token/jwtDecode";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../states/store";
import { loginSuccess } from "../../../states/authSlice";
import type { User } from "../../../models/AuthModel/authModel";

interface AuthProps {
  show: boolean;
  handleClose: () => void;
}

export default function Authentication({
  show,
  handleClose,
}: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(true); // true: signUp | false : login
  const [isOTP, setIsOTP] = useState(false); // true: verify Otp

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Redux
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async () => {
    const loginData: LoginRequestDto = {
      email: email,
      password: password,
    };
    try {
      const response = await login(loginData);
      if (response.statusCode != HTTP_STATUS.OK) {
        throw new Error(
          ERROR_MESSAGE.LOGIN_FAILED
        );
      }
      const token = response.data?.accessToken;
      if (!token) {
        throw new Error(
          ERROR_MESSAGE.SOME_THING_WENT_WRONG
        );
      }
      saveTokens(token);
      const payload = decodeJwt(token);
      const user: User = {
        accountId: Number(payload.nameid),
        email: payload.email,
        role: payload.role,
      };
      dispatch(loginSuccess(user));
      alert("Success");
    } catch (err) {
      if (err instanceof Error) {
        console.error(
          "Login error:",
          err.message
        );
      } else {
        console.error("Login error:", err);
      }
    }
  };

  const handleSignUp = () => {
    // TODO: gọi API gửi OTP tới email ở đây
    setIsOTP(true);
  };

  const handleVerifyOTP = () => {
    // TODO: verify OTP API call
    alert(SUCCESS_MESSAGE.REGISTER_SUCCESS);
    setIsOTP(false);
    handleClose();
  };

  return (
    <StyledModal
      show={show}
      onHide={handleClose}
      centered
    >
      <SideImage $isSignUp={isSignUp}>
        <img src={logo} alt="EVCare Logo" />
      </SideImage>
      <FormContainer $isSignUp={isSignUp}>
        <HeaderBox>
          <h1>
            {isOTP
              ? AUTH_FORM_MESSAGE.VERIFY
              : isSignUp
              ? AUTH_FORM_MESSAGE.REGISTER
              : AUTH_FORM_MESSAGE.WELCOME_BACK}
          </h1>
          {!isOTP ? (
            <SwitchButton
              isSignUp={isSignUp}
              onChange={setIsSignUp}
            />
          ) : undefined}
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
            handleSignUp={handleSignUp}
            handleLogin={handleLogin}
          />
        ) : (
          <OTPForm
            handleVerifyOTP={handleVerifyOTP}
          />
        )}
      </FormContainer>
    </StyledModal>
  );
}
