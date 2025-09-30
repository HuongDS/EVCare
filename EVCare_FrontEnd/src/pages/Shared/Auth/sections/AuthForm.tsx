import { FormWrapper, SubmitBtn, Divider } from "../Authentication.styled";
import GoogleButton from "../google/GoogleButton";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";

interface AuthFormProps {
  isSignUp: boolean;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirm: string;
  setConfirm: (v: string) => void;
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  handleSignUp: () => void;
  handleLogin: () => void;
  isForgot: boolean;
  setIsForgot: (v: boolean) => void;
}

export default function AuthForm({
  isSignUp,
  email,
  setEmail,
  password,
  setPassword,
  confirm,
  setConfirm,
  firstName,
  setFirstName,
  lastName,
  phone,
  setPhone,
  setLastName,
  handleSignUp,
  handleLogin,
  setIsForgot,
}: AuthFormProps) {
  const handleIsForgot = () => {
    isSignUp = false;
    setIsForgot(true);
  };
  return (
    <FormWrapper>
      {isSignUp ? (
        <SignUpForm
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirm={confirm}
          setConfirm={setConfirm}
          phone={phone}
          setPhone={setPhone}
          handleSignUp={handleSignUp}
        />
      ) : (
        <SignInForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
          handleIsForgot={handleIsForgot}
        />
      )}

      <Divider>
        <hr />
        <span>OR</span>
      </Divider>

      <SubmitBtn
        type="button"
        style={{
          backgroundColor: "#fff",
          color: "black",
        }}
      >
        <GoogleButton />
      </SubmitBtn>
    </FormWrapper>
  );
}
