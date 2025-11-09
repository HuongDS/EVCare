import { Button, Card, Tag } from "antd";
import styled, { keyframes } from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    rgba(59, 246, 149, 0.5) 0%,
    rgba(44, 226, 117, 0.5) 100%
  );

  padding: 32px 20px;
  border-radius: 20px;
  * {
    font-family: "Outfit", sans-serif !important;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 90%;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

export const Header = styled.div`
  padding: 24px 32px;
  background: #00ad4e;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;

    h1 {
      font-size: 24px;
    }
  }
`;

export const AppointmentTag = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
`;

export const MainContent = styled.div`
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const StyledCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .ant-card-head {
    background: #f8f9fa;
    font-weight: 700;
    font-size: 16px;
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const InfoLabel = styled.div`
  font-size: 12px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const InfoValue = styled.div`
  font-size: 15px;
  color: #333;
  font-weight: 600;
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TotalLabel = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #333;
`;

export const TotalAmount = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #00ad4e;
`;

export const PaymentButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const PaymentBtn = styled(Button)<{ $selected: boolean }>`
  height: 64px !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  font-size: 15px !important;
  transition: all 0.3s ease !important;

  ${(props) =>
    props.$selected
      ? `
    background: linear-gradient(135deg, #00ad4e 0%, #00c853 100%) !important;
    color: white !important;
    border-color: #00ad4e !important;
    box-shadow: 0 4px 12px rgba(0, 173, 78, 0.4) !important;
    transform: translateY(-2px);
  `
      : `
    background: white !important;
    color: #00ad4e !important;
    border: 2px solid #00ad4e !important;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 173, 78, 0.2) !important;
    }

    &:disabled {
      opacity: 0.6 !important;
      pointer-events: none !important;
      background: #f0f0f0 !important;
      color: #999 !important;
      border-color: #ddd !important;
      box-shadow: none !important;
      transform: none !important;
    }
  `}
`;

export const QRSection = styled.div`
  margin-top: 24px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  iframe {
    width: 100%;
    height: 60vh;
  }
`;

export const QRInfo = styled.div`
  text-align: center;

  p {
    margin: 0 0 8px 0;
    color: #666;
    font-size: 14px;
  }
`;

export const AmountTag = styled(Tag)`
  font-size: 16px !important;
  padding: 8px 16px !important;
  font-weight: 700 !important;
  background: #00ad4e !important;
  color: white !important;
  border: none !important;
`;

export const Footer = styled.div`
  display: flex;
  gap: 10px;
  padding: 24px 32px;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const ConfirmButton = styled(Button)`
  width: 100%;
  height: 56px !important;
  font-size: 18px !important;
  font-weight: 700 !important;
  background: linear-gradient(135deg, #00ad4e 0%, #00c86b 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  box-shadow: 0 6px 20px rgba(0, 173, 78, 0.4) !important;
  color: white !important;
  transition: all 0.2s ease !important;

  &:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 24px rgba(0, 173, 78, 0.5) !important;
  }

  &:disabled {
    background: #c8e6c9 !important;
    color: #666 !important;
    box-shadow: none !important;
    transform: none !important;
  }
`;

export const TableSection = styled.div`
  margin-bottom: 32px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.thead`
  background: #f5f5f5;

  th {
    padding: 12px;
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &:nth-child(2) {
      text-align: center;
    }

    &:nth-child(3),
    &:nth-child(4),
    &:nth-child(5) {
      text-align: right;
    }
  }

  @media (max-width: 768px) {
    th {
      padding: 10px 8px;
      font-size: 12px;
    }
  }
`;

export const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #e0e0e0;

    &:last-child {
      border-bottom: none;
    }
  }

  td {
    padding: 14px 12px;
    font-size: 14px;
    color: #333;

    &:nth-child(2) {
      text-align: center;
      font-weight: 600;
    }

    &:nth-child(3),
    &:nth-child(4),
    &:nth-child(5) {
      text-align: right;
      font-weight: 600;
    }
  }

  @media (max-width: 768px) {
    td {
      padding: 12px 8px;
      font-size: 13px;
    }
  }
`;

export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const PaymentCard = styled.div`
  margin-top: 10px;
  padding: 16px;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
`;

export const FlexContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const TextContainer = styled.div`
  flex: 1;
`;

export const MainText = styled.p`
  font-size: 14px;
  color: #00ad4e;
  font-weight: 600;
  margin: 0 0 4px 0;
`;

export const Description = styled.p`
  font-size: 14px;
  color: #00ad4e;
  margin: 0 0 8px 0;
`;

export const HintText = styled.p`
  font-size: 12px;
  color: #00ad4e;
  margin: 0;
`;
