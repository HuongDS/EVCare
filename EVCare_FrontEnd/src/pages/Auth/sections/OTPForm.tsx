import { type Dispatch, type SetStateAction } from "react";
import styled from "styled-components";
import { Shield, Mail } from "lucide-react";
import { ONE_NUMBER_REGEX } from "../../../constants/regexs/NumberRegex";
import SpinnerComponent from "../../../components/SpinnerComponent";
import ShowButton from "../../../components/Button/ShowButton";

type OTPFormProps = {
  setIsOpen: (v: boolean) => void;
  otp: string[];
  setOtp: Dispatch<SetStateAction<string[]>>;
  handleVerifyOTP: () => void;
  disable: boolean;
};

export default function OTPForm({
  setIsOpen,
  otp,
  setOtp,
  handleVerifyOTP,
  disable,
}: OTPFormProps) {
  const handleChange = (i: number, val: string) => {
    if (val !== "" && !ONE_NUMBER_REGEX.test(val)) return;

    setOtp((prev) => {
      const next = [...prev];
      next[i] = val;
      return next;
    });

    if (val && i < 5) {
      const nextInput = document.getElementById(`otp-${i + 1}`);
      nextInput?.focus();
    } else if (!val && i > 0) {
      const prevInput = document.getElementById(`otp-${i - 1}`);
      prevInput?.focus();
    }
  };

  const handleKeyDown = (
    i: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      const prevInput = document.getElementById(`otp-${i - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const digits = pastedData
      .split("")
      .filter((ch) => ONE_NUMBER_REGEX.test(ch));

    setOtp(() => {
      const newArr = new Array(6).fill("");
      digits.forEach((digit, i) => (newArr[i] = digit));
      return newArr;
    });
  };

  const isComplete = otp?.every((digit) => digit !== "");

  return (
    <FormContainer>
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <ShowButton
          text="Back"
          onclick={() => {
            setIsOpen(false), setOtp([]);
          }}
        />
      </div>
      <IconWrapper>
        <Shield size={48} />
      </IconWrapper>

      <Title>Verify Your Email</Title>

      <Description>
        <Mail size={16} />
        Enter the 6-digit code sent to your email
      </Description>

      <OTPInputWrapper>
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <OTPInput
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength={1}
              inputMode="numeric"
              value={otp?.[i] ?? ""}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              $filled={!!otp?.[i]}
            />
          ))}
      </OTPInputWrapper>

      {disable ? (
        <SpinnerWrapper>
          <SpinnerComponent />
        </SpinnerWrapper>
      ) : (
        <VerifyButton
          type="button"
          onClick={handleVerifyOTP}
          disabled={!isComplete}
          $enabled={isComplete}
        >
          Verify Code
        </VerifyButton>
      )}
    </FormContainer>
  );
}

const FormContainer = styled.div`
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  padding: 40px 30px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: "Outfit", sans-serif;

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #00ad4e 0%, #00c853 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 20px rgba(0, 173, 78, 0.3);
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Description = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 15px;
  color: #666;
  margin: 0 0 32px 0;

  svg {
    color: #00ad4e;
    flex-shrink: 0;
  }
`;

const OTPInputWrapper = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const OTPInput = styled.input<{ $filled: boolean }>`
  width: 40px;
  height: 40px;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  font-family: "Outfit", sans-serif;
  border: 2px solid ${(props) => (props.$filled ? "#00ad4e" : "#e0e0e0")};
  border-radius: 12px;
  background: ${(props) => (props.$filled ? "#f1f8f4" : "white")};
  color: #333;
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    border-color: #00ad4e;
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.1);
    transform: scale(1.05);
  }

  /* Remove number input arrows */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
`;

const VerifyButton = styled.button<{ $enabled: boolean }>`
  width: 100%;
  padding: 16px;
  background: ${(props) =>
    props.$enabled
      ? "linear-gradient(135deg, #00ad4e 0%, #00c853 100%)"
      : "#e0e0e0"};
  color: ${(props) => (props.$enabled ? "white" : "#9e9e9e")};
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  font-family: "Outfit", sans-serif;
  cursor: ${(props) => (props.$enabled ? "pointer" : "not-allowed")};
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    props.$enabled ? "0 4px 12px rgba(0, 173, 78, 0.3)" : "none"};
  margin-bottom: 20px;

  &:hover {
    ${(props) =>
      props.$enabled &&
      `
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 173, 78, 0.4);
    `}
  }

  &:active {
    transform: translateY(0);
  }
`;

const SpinnerWrapper = styled.div`
  padding: 16px;
  margin-bottom: 20px;
`;

const ResendText = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

const ResendLink = styled.span`
  color: #00ad4e;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    text-decoration: underline;
    color: #00c853;
  }
`;
