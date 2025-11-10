import styled from "styled-components";

export const PageContainer = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: "Outfit", sans-serif;
`;

export const ContentCard = styled.div`
  max-width: 500px;
  width: 100%;
  background: white;
  border-radius: 24px;
  padding: 60px 40px;
  box-shadow: 0 10px 40px rgba(0, 173, 78, 0.2);
  text-align: center;

  @media (max-width: 768px) {
    padding: 40px 28px;
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #00ad4e;
  margin: 0 auto 24px;
  opacity: 0.9;
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #00ad4e;
  margin: 0 0 24px 0;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

export const DateText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 16px;
  color: #666;
  font-weight: 600;
  margin-bottom: 24px;

  svg {
    color: #00ad4e;
  }
`;

export const Message = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0 0 40px 0;
  line-height: 1.8;
`;

export const FooterNote = styled.p`
  font-size: 15px;
  color: #00ad4e;
  font-weight: 600;
  margin: 0;
`;
