import styled from "styled-components";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

interface Props {
  onRetry?: () => void;
  onGoHome?: () => void;
}

export default function ErrorPage({ onRetry, onGoHome }: Props) {
  return (
    <PageContainer>
      <ContentCard>
        <ErrorIcon>
          <AlertCircle size={80} />
        </ErrorIcon>

        <Title>Something Went Wrong</Title>

        <Message>
          We're sorry, but something unexpected happened.
          <br />
          Please try again or return to the home page.
        </Message>

        <ButtonGroup>
          {onRetry && (
            <Button onClick={onRetry}>
              <RefreshCw size={18} />
              Try Again
            </Button>
          )}
          {onGoHome && (
            <Button $primary onClick={onGoHome}>
              <Home size={18} />
              Go Home
            </Button>
          )}
        </ButtonGroup>
      </ContentCard>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  height: 100%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: "Outfit", sans-serif;
`;

const ContentCard = styled.div`
  max-width: 500px;
  width: 100%;
  background: white;
  border-radius: 16px;
  padding: 60px 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;

  @media (max-width: 768px) {
    padding: 40px 24px;
  }
`;

const ErrorIcon = styled.div`
  color: #757575;
  margin: 0 auto 24px;
  opacity: 0.8;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #424242;
  margin: 0 0 16px 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Message = styled.p`
  font-size: 15px;
  color: #757575;
  margin: 0 0 32px 0;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: 2px solid ${(props) => (props.$primary ? "#616161" : "#e0e0e0")};
  background: ${(props) => (props.$primary ? "#616161" : "white")};
  color: ${(props) => (props.$primary ? "white" : "#616161")};
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => (props.$primary ? "#424242" : "#f5f5f5")};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;
