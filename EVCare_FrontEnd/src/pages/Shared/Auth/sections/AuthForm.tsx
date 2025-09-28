import { Link } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { FiKey, FiPhone } from "react-icons/fi";
// import { FcGoogle } from "react-icons/fc";
import TextFieldWithIcon from "../../../../components/TextFieldWithIcon/TextFieldWithIcon";
import TextFieldAnimation from "../../../../components/TextField/TextFieldAnimation";
import { FormWrapper, FieldGroup, SubmitBtn, Divider, NameGroup } from "../Authentication.styled";
import GoogleButton from "../google/GoogleButton";

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
}: AuthFormProps) {
  return (
    <FormWrapper>
      {isSignUp && (
        <NameGroup>
          <TextFieldAnimation required type="First Name" text={firstName} setText={setFirstName} />
          <TextFieldAnimation required type="Last Name" text={lastName} setText={setLastName} />
        </NameGroup>
      )}
      <FieldGroup>
        <TextFieldWithIcon required icon={<HiOutlineMail />} type="Email" text={email} setText={setEmail} />
        <TextFieldWithIcon required icon={<FiKey />} type="Password" text={password} setText={setPassword} />
        {isSignUp && (
          <TextFieldWithIcon required icon={<FiKey />} type="Password" text={confirm} setText={setConfirm} />
        )}
        {isSignUp && (
          <TextFieldWithIcon required icon={<FiPhone />} type="Phone Number" text={phone} setText={setPhone} />
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

      <SubmitBtn type="button" onClick={isSignUp ? handleSignUp : handleLogin}>
        {isSignUp ? "Sign Up" : "Sign In"}
      </SubmitBtn>

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
        {/* <FcGoogle
          style={{
            marginRight: "20px",
            fontSize: "25px",
          }}
        /> */}
        <GoogleButton />
        {/* {isSignUp ? "Sign Up with Google" : "Sign In with Google"} */}
      </SubmitBtn>
    </FormWrapper>
  );
}
