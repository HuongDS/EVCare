import logo from "../../assets/EVCare.png";
import SwitchButton from "../../components/Button/SwitchButton";
import { FormContainer, HeaderBox, SideImage, StyledModal } from "./Authentication.styled";
import AuthForm from "./sections/AuthForm";
import ResetPasswordForm from "./sections/ResetPasswordForm";
import { closeLogin } from "../../states/uiSlice";
import ForgotPassword from "./sections/ForgotPassword";
import { useAuthentication } from "../../hooks/useAuthentication";

// interface AuthProps {
//   show: boolean;
//   handleClose: () => void;
// }

export default function Authentication() {
  const {
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

    dispatch,
    loginFormOpen,

    setIsSignUp,
    setEmail,
    setPassword,
    setConfirm,
    setFirstName,
    setLastName,
    setPhone,
    setIsForgot,

    handleLogin,
    handleSignUp,
    handleSubmitResetPassword,
    handChangeIsForgot,
    headerText,
  } = useAuthentication();

  return (
    <>
      <StyledModal show={loginFormOpen} onHide={() => dispatch(closeLogin())} centered backdrop={true}>
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
            <ResetPasswordForm disable={isLoading} handleSubmit={handleSubmitResetPassword} />
          )}
        </FormContainer>
      </StyledModal>
    </>
  );
}
