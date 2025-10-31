import TextFieldWithIcon from "../../../components/TextFieldWithIcon/TextFieldWithIcon";
import { HiOutlineMail } from "react-icons/hi";
import { FiKey } from "react-icons/fi";
import { FieldGroup, SubmitBtn } from "../Authentication.styled";
import { Link } from "react-router";
import SpinnerComponent from "../../../components/SpinnerComponent";

import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface SignInProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  disable: boolean;
  handleLogin: () => void;
  handleIsForgot: () => void;
}

//validate các field
const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInForm({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  handleIsForgot,
  disable,
}: SignInProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SignInFormData> = () => {
    handleLogin();
  };
  return (
    <>
      <FieldGroup>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextFieldWithIcon
              required={true}
              icon={<HiOutlineMail />}
              type="Email"
              text={field.value}
              setText={field.onChange}
            />
          )}
        />
        <TextFieldWithIcon
          required={true}
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
      {disable ? (
        <SpinnerComponent />
      ) : (
        <SubmitBtn type="submit" onClick={handleLogin}>
          Sign In
        </SubmitBtn>
      )}
    </>
  );
}
