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

interface AuthProps {
  show: boolean;
  handleClose: () => void;
}

export default function Authentication({ show, handleClose }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [isOTP, setIsOTP] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSignUp = () => {
    // TODO: gọi API gửi OTP tới email ở đây
    setIsOTP(true);
  };

  const handleVerifyOTP = () => {
    // TODO: verify OTP API call
    alert("OTP verified! Account created.");
    setIsOTP(false);
    handleClose();
  };

  return (
    <StyledModal show={show} onHide={handleClose} centered>
      <SideImage $isSignUp={isSignUp}>
        <img src={logo} alt="EVCare Logo" />
      </SideImage>

      <FormContainer $isSignUp={isSignUp}>
        <HeaderBox>
          <h1>
            {isOTP
              ? "Verify Email"
              : isSignUp
              ? "Create Account"
              : "Welcome Back"}
          </h1>
          {!isOTP ? (
            <SwitchButton isSignUp={isSignUp} onChange={setIsSignUp} />
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
          />
        ) : (
          <OTPForm handleVerifyOTP={handleVerifyOTP} />
        )}
      </FormContainer>
    </StyledModal>
  );
}
