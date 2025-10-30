import TextFieldWithIcon from "../../../components/TextFieldWithIcon/TextFieldWithIcon";
import { HiOutlineMail } from "react-icons/hi";
import { FormWrapper, SubmitBtn } from "../Authentication.styled";
import SpinnerComponent from "../../../components/SpinnerComponent";

interface ForgotProps {
  email: string;
  setEmail: (v: string) => void;
  isLoading: boolean;
  handChangeIsForgot: () => void;
}
export default function ForgotPassword({
  email,
  setEmail,
  isLoading,
  handChangeIsForgot,
}: ForgotProps) {
  return (
    <FormWrapper>
      <TextFieldWithIcon
        required={true}
        icon={<HiOutlineMail />}
        type="Email"
        text={email}
        setText={setEmail}
      />
      {isLoading ? (
        <SpinnerComponent />
      ) : (
        <SubmitBtn type="button" onClick={() => handChangeIsForgot()}>
          Send
        </SubmitBtn>
      )}
    </FormWrapper>
  );
}
