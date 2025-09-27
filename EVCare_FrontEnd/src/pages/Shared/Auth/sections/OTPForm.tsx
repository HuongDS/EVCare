import { FormWrapper, SubmitBtn } from "../Authentication.styled";

interface OTPFormProps {
  handleVerifyOTP: () => void;
}

export default function OTPForm({ handleVerifyOTP }: OTPFormProps) {
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
              style={{
                width: "50px",
                height: "50px",
                textAlign: "center",
                fontSize: "1.5rem",
                border: "1px solid #ccc",
              }}
            />
          ))}
      </div>
      <SubmitBtn type="button" onClick={handleVerifyOTP}>
        Verify OTP
      </SubmitBtn>
    </FormWrapper>
  );
}
