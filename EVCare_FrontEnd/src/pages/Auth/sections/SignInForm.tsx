import TextFieldWithIcon from "../../../components/TextFieldWithIcon/TextFieldWithIcon";
import { HiOutlineMail } from "react-icons/hi";
import { FiKey } from "react-icons/fi";
import { FieldGroup, SubmitBtn } from "../Authentication.styled";
import { Link } from "react-router";
import SpinnerComponent from "../../../components/SpinnerComponent";
import { isValidEmail, isValidPassword } from "../validation/validation";
import { ERROR_MESSAGE } from "../../../constants/messages/Message";
import { Tooltip } from "antd";

interface SignInProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  disable: boolean;
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
  disable,
}: SignInProps) {
  const error = () => {
    if (!isValidEmail(email) || !isValidPassword(password)) {
      return true;
    }
    return false;
  };

  const disabled = error();
  return (
    <>
      <FieldGroup>
        <TextFieldWithIcon
          required={true}
          icon={<HiOutlineMail />}
          type="email"
          label="Email"
          text={email}
          setText={setEmail}
          error={email !== "" && !isValidEmail(email)}
          errorMessage={ERROR_MESSAGE.INVALID_EMAIL}
        />
        <TextFieldWithIcon
          id="pass"
          required={true}
          icon={<FiKey />}
          type="password"
          label="Password"
          text={password}
          setText={setPassword}
          error={password !== "" && !isValidPassword(password)}
          errorMessage={ERROR_MESSAGE.INVALID_PASSWORD_LOGIN}
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
      {disable ? (
        <SpinnerComponent />
      ) : (
        <Tooltip
          title={disabled ? "Please enter email and password" : ""}
          placement="top"
          color="#00AD4E"
          style={{ fontFamily: "Outfit" }}
        >
          <SubmitBtn
            type="submit"
            onClick={handleLogin}
            $disabled={disabled}
            disabled={disabled}
          >
            Sign In
          </SubmitBtn>
        </Tooltip>
      )}
    </>
  );
}
