import styled, { keyframes } from "styled-components";

export const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

export const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: "Outfit", sans-serif;
`;

export const ContentCard = styled.div`
  max-width: 800px;
  width: 100%;
  background: white;
  border-radius: 24px;
  padding: 60px 40px;
  box-shadow: 0 20px 60px rgba(0, 173, 78, 0.3);
  text-align: center;

  @media (max-width: 768px) {
    padding: 40px 24px;
  }
`;

export const AnimatedIcon = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 30px;
  background: linear-gradient(135deg, #00ad4e 0%, #00c853 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 2s ease-in-out infinite;
  box-shadow: 0 10px 30px rgba(0, 173, 78, 0.4);
`;

export const Title = styled.h1`
  font-size: 30px;
  font-weight: 700;
  color: #00ad4e;
  margin: 0 0 16px 0;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

export const ProgressSection = styled.div`
  background: linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 100%);
  border-radius: 16px;
  padding: 32px;
  margin: 0 0 40px 0;
  border: 2px solid #c8e6c9;
`;

export const ProgressLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  color: #00ad4e;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
`;

export const ProgressText = styled.div`
  font-size: 14px;
  color: #666;
  font-weight: 500;
  font-style: italic;
`;

export const ExpectedBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  border-radius: 12px;
  border: 2px solid #c8e6c9;
  color: #00ad4e;
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 30px;
`;
