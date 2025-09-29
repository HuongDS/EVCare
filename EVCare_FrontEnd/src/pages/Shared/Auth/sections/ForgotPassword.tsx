import TextFieldWithIcon from "../../../../components/TextFieldWithIcon/TextFieldWithIcon";
import { HiOutlineMail } from "react-icons/hi";
import { FormWrapper, SubmitBtn } from "../Authentication.styled";

interface ForgotProps {
  email: string;
  setEmail: (v: string) => void;
  setIsForgot: (v: boolean) => void;
  setIsOTP: (v: boolean) => void;
}
export default function ForgotPassword({
  email,
  setEmail,
  setIsForgot,
  setIsOTP,
}: ForgotProps) {
  const handleChangeIsForgot = () => {
    setIsForgot(false);
    setIsOTP(true);
  };
  return (
    <FormWrapper>
      <TextFieldWithIcon
        required
        icon={<HiOutlineMail />}
        type="Email"
        text={email}
        setText={setEmail}
      />
      <SubmitBtn type="button" onClick={handleChangeIsForgot}>
        Send
      </SubmitBtn>
    </FormWrapper>
  );
}
