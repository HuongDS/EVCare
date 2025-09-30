import { HiOutlineMail } from "react-icons/hi";
import TextFieldAnimation from "../../../../components/TextField/TextFieldAnimation";
import { FieldGroup, NameGroup, SubmitBtn } from "../Authentication.styled";
import { FiKey, FiPhone } from "react-icons/fi";
import TextFieldWithIcon from "../../../../components/TextFieldWithIcon/TextFieldWithIcon";

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
  handleSignUp,
}: SignUpProps) {
  return (
    <>
      <NameGroup>
        <TextFieldAnimation
          required
          type="First Name"
          text={firstName}
          setText={setFirstName}
        />
        <TextFieldAnimation
          required
          type="Last Name"
          text={lastName}
          setText={setLastName}
        />
      </NameGroup>
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
        <TextFieldWithIcon
          required
          icon={<FiKey />}
          type="Password"
          text={confirm}
          setText={setConfirm}
        />
        <TextFieldWithIcon
          required
          icon={<FiPhone />}
          type="Phone Number"
          text={phone}
          setText={setPhone}
        />
      </FieldGroup>
      <SubmitBtn type="button" onClick={handleSignUp}>
        Sign Up
      </SubmitBtn>
    </>
  );
}
