import styled from "styled-components";
import { Mail, ArrowLeft } from "lucide-react";
import SpinnerComponent from "../../../components/SpinnerComponent";
import ShowButton from "../../../components/Button/ShowButton";

interface ForgotProps {
  email: string;
  setEmail: (v: string) => void;
  isLoading: boolean;
  handChangeIsForgot: () => void;
  onBack?: () => void;
  setIsForgot: (v: boolean) => void;
}

export default function ForgotPassword({
  email,
  setEmail,
  isLoading,
  handChangeIsForgot,
  onBack,
  setIsForgot,
}: ForgotProps) {
  return (
    <PageContainer>
      <FormCard>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <ShowButton text="Back" onclick={() => setIsForgot(false)} />
        </div>
        <IconWrapper>
          <Mail size={48} />
        </IconWrapper>

        <Description>
          No worries! Enter your email address and we'll send you a reset link.
        </Description>

        <FormContent>
          <InputGroup>
            <InputLabel>Email Address</InputLabel>
            <InputWrapper>
              <InputIcon>
                <Mail size={20} />
              </InputIcon>
              <StyledInput
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputWrapper>
          </InputGroup>

          {isLoading ? (
            <SpinnerWrapper>
              <SpinnerComponent />
            </SpinnerWrapper>
          ) : (
            <SubmitButton
              type="button"
              onClick={handChangeIsForgot}
              disabled={!email}
              $enabled={!!email}
            >
              Send OTP
            </SubmitButton>
          )}

          {onBack && (
            <BackButton onClick={onBack}>
              <ArrowLeft size={18} />
              Back to Login
            </BackButton>
          )}
        </FormContent>
      </FormCard>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Outfit", sans-serif;
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 450px;
  background: white;
  border-radius: 20px;
  padding: 38px 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  text-align: center;

  @media (max-width: 768px) {
    padding: 36px 28px;
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

const Description = styled.p`
  font-size: 15px;
  color: #666;
  margin: 0 0 32px 0;
  line-height: 1.6;
`;

const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: left;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InputLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  color: #999;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  font-family: "Outfit", sans-serif;
  color: #333;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ad4e;
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const SubmitButton = styled.button<{ $enabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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
  display: flex;
  justify-content: center;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background: transparent;
  color: #00ad4e;
  border: 2px solid #00ad4e;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e8f5e9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
