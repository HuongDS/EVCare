import { Link } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { FiKey } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import TextFieldWithIcon from "../../../../components/TextFieldWithIcon/TextFieldWithIcon";
import TextFieldAnimation from "../../../../components/TextField/TextFieldAnimation";
import {
  FormWrapper,
  FieldGroup,
  SubmitBtn,
  Divider,
  NameGroup,
} from "../Authentication.styled";

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
  handleSignUp: () => void;
  handleLogin: () => void;
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
  setLastName,
  handleSignUp,
  handleLogin,
}: AuthFormProps) {
  return (
    <FormWrapper>
      {isSignUp && (
        <NameGroup>
          <TextFieldAnimation
            type="First Name"
            text={firstName}
            setText={setFirstName}
          />
          <TextFieldAnimation
            type="Last Name"
            text={lastName}
            setText={setLastName}
          />
        </NameGroup>
      )}
      <FieldGroup>
        <TextFieldWithIcon
          icon={<HiOutlineMail />}
          type="Email"
          text={email}
          setText={setEmail}
        />
        <TextFieldWithIcon
          icon={<FiKey />}
          type="Password"
          text={password}
          setText={setPassword}
        />
        {isSignUp && (
          <TextFieldWithIcon
            icon={<FiKey />}
            type="Confirm Password"
            text={confirm}
            setText={setConfirm}
          />
        )}
      </FieldGroup>

      {!isSignUp && (
        <Link
          to="#"
          style={{
            alignSelf: "flex-end",
            fontSize: "0.85rem",
            textDecoration: "none",
            color: "green",
          }}
        >
          Forgot Password?
        </Link>
      )}

      <SubmitBtn
        type="button"
        onClick={
          isSignUp ? handleSignUp : handleLogin
        }
      >
        {isSignUp ? "Sign Up" : "Sign In"}
      </SubmitBtn>

      <Divider>
        <hr />
        <span>OR</span>
      </Divider>

      <SubmitBtn
        type="button"
        style={{
          backgroundColor: "#ccc",
          color: "black",
        }}
      >
        <FcGoogle
          style={{
            marginRight: "20px",
            fontSize: "25px",
          }}
        />
        {isSignUp
          ? "Sign Up with Google"
          : "Sign In with Google"}
      </SubmitBtn>
    </FormWrapper>
  );
}
