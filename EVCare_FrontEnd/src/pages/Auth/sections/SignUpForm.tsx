import { HiOutlineMail } from "react-icons/hi";
import TextFieldAnimation from "../../../components/TextField/TextFieldAnimation";
import { FieldGroup, NameGroup, SubmitBtn } from "../Authentication.styled";
import { FiKey, FiPhone } from "react-icons/fi";
import TextFieldWithIcon from "../../../components/TextFieldWithIcon/TextFieldWithIcon";
import SpinnerComponent from "../../../components/SpinnerComponent";
import {
  isValidConfirmPassword,
  isValidEmail,
  isValidPhoneNumber,
  isValidSignUpPassword,
} from "../validation/validation";
import { ERROR_MESSAGE } from "../../../constants/messages/Message";
import { Tooltip } from "antd";

interface SignUpProps {
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
  disable: boolean;
  setPhone: (v: string) => void;
  handleSignUp: () => void;
}

export default function SignUpForm({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  confirm,
  setConfirm,
  phone,
  setPhone,
  disable,
  handleSignUp,
}: SignUpProps) {
  const error = () => {
    if (
      firstName.trim().length === 0 ||
      lastName.trim().length === 0 ||
      !isValidEmail(email) ||
      !isValidSignUpPassword(password) ||
      !isValidConfirmPassword(confirm, password) ||
      !isValidPhoneNumber(phone)
    ) {
      return true;
    }
    return false;
  };

  const disabled = error();

  return (
    <>
      <NameGroup>
        <TextFieldAnimation
          required={true}
          type="First Name"
          text={firstName}
          setText={setFirstName}
          error={firstName !== "" && firstName.trim().length === 0}
        />
        <TextFieldAnimation
          required={true}
          type="Last Name"
          text={lastName}
          setText={setLastName}
          error={lastName !== "" && lastName.trim().length === 0}
        />
      </NameGroup>
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
          type="text"
          label="Password"
          text={password}
          setText={setPassword}
          error={password !== "" && !isValidSignUpPassword(password)}
          errorMessage={ERROR_MESSAGE.INVALID_PASSWORD}
        />
        <TextFieldWithIcon
          required={true}
          icon={<FiKey />}
          type="password"
          label="Confirmed Password"
          text={confirm}
          setText={setConfirm}
          error={confirm !== "" && !isValidConfirmPassword(confirm, password)}
          errorMessage={
            ERROR_MESSAGE.PASSWORD_AND_CONFIRM_PASSWORD_MUST_BE_SAME
          }
        />
        <TextFieldWithIcon
          required={true}
          icon={<FiPhone />}
          type="text"
          label="Phone Number"
          text={phone}
          setText={setPhone}
          error={phone !== "" && !isValidPhoneNumber(phone)}
          errorMessage={ERROR_MESSAGE.INVALID_PHONE}
        />
      </FieldGroup>
      {disable ? (
        <SpinnerComponent />
      ) : (
        <Tooltip
          title={disabled ? "Please enter all field" : ""}
          placement="top"
          color="#00AD4E"
          style={{ fontFamily: "Outfit" }}
        >
          <SubmitBtn
            type="button"
            onClick={handleSignUp}
            $disabled={disabled}
            disabled={disabled}
          >
            Sign Up
          </SubmitBtn>
        </Tooltip>
      )}
    </>
  );
}
