import type { Dispatch, SetStateAction } from "react";
import { ONE_NUMBER_REGEX } from "../../../../constants/regexs/NumberRegex";
import { FormWrapper, SubmitBtn } from "../Authentication.styled";
import { LENGTH } from "../../../../constants/Code/Constants";

type OTPFormProps = {
  otp: string[];
  setOtp: Dispatch<SetStateAction<string[]>>;
  handleVerifyOTP: () => void;
};

export default function OTPForm({ otp, setOtp, handleVerifyOTP }: OTPFormProps) {
  const handleChange = (i: number, val: string) => {
    if (!ONE_NUMBER_REGEX.test(val)) return;
    setOtp((prev) => {
      const next = [...prev];
      next[i] = val;
      return next;
    });
  };

  const isDisabled = otp.join("").length !== LENGTH.OTP_LENGTH;
  return (
    <FormWrapper>
      <p>Enter the 6-digit code sent to your email:</p>
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              inputMode="numeric"
              style={{
                width: "50px",
                height: "50px",
                textAlign: "center",
                fontSize: "1.5rem",
                border: "1px solid #ccc",
              }}
              value={otp[i]}
              onChange={(e) => handleChange(i, e.target.value)}
            />
          ))}
      </div>
      <SubmitBtn type="button" disabled={isDisabled} onClick={handleVerifyOTP}>
        Verify OTP
      </SubmitBtn>
    </FormWrapper>
  );
}
