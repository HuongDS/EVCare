import TextFieldWithIcon from "../../../../components/TextFieldWithIcon/TextFieldWithIcon";
import { HiOutlineMail } from "react-icons/hi";
import { FiKey } from "react-icons/fi";
import { FieldGroup, SubmitBtn } from "../Authentication.styled";
import { Link } from "react-router";

interface SignInProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  handleLogin: () => void;
  handleIsForgot: () => void;
}

export default function SignInForm({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  handleIsForgot,
}: SignInProps) {
  return (
    <>
      <FieldGroup>
        <TextFieldWithIcon
          required
          icon={<HiOutlineMail />}
          type="Email"
          text={email}
          setText={setEmail}
        />
        <TextFieldWithIcon
          required
          icon={<FiKey />}
          type="Password"
          text={password}
          setText={setPassword}
        />
      </FieldGroup>
      <Link
        to="#"
        style={{
          alignSelf: "flex-end",
          fontSize: "0.85rem",
          textDecoration: "none",
          color: "green",
        }}
        onClick={handleIsForgot}
      >
        Forgot Password?
      </Link>
      <SubmitBtn type="button" onClick={handleLogin}>
        Sign In
      </SubmitBtn>
    </>
  );
}
