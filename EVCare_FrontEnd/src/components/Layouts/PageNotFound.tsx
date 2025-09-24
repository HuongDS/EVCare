import React from "react";
import styled from "styled-components";
import { ArrowLeft, Home, Car } from "lucide-react";

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1e40af, #4338ca);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 4rem;
  color: #1e40af;
  margin: 0 0 20px 0;
  font-weight: bold;
`;

const Subtitle = styled.h2`
  color: #374151;
  margin: 0 0 15px 0;
  font-size: 1.5rem;
`;

const Description = styled.p`
  color: #6b7280;
  margin: 0 0 30px 0;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s ease;

  ${(props) =>
    props.$primary
      ? `
    background: #1e40af;
    color: white;
    
    &:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }
  `
      : `
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
      transform: translateY(-1px);
    }
  `}
`;

const CarIcon = styled(Car)`
  color: #1e40af;
  margin: 20px 0;
`;

const PageNotFound: React.FC = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <PageContainer>
      <Card>
        <Title>404</Title>
        <CarIcon size={48} />
        <Subtitle>Page Not Found</Subtitle>
        <Description>
          Sorry, we couldn't find the page you're looking for. Let's get you
          back to our EV care services.
        </Description>
        <ButtonGroup>
          <Button $primary onClick={handleGoHome}>
            <Home size={18} />
            Home
          </Button>
          <Button onClick={handleGoBack}>
            <ArrowLeft size={18} />
            Go Back
          </Button>
        </ButtonGroup>
      </Card>
    </PageContainer>
  );
};

export default PageNotFound;
