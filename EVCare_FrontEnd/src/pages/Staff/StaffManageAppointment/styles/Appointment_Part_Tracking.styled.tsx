import styled from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    rgba(170, 255, 211, 0.5) 0%,
    rgba(174, 255, 206, 0.5) 20%
  );
  padding: 32px 20px;
  font-family: "Outfit", sans-serif;
`;

export const ContentWrapper = styled.div`
  max-width: 896px;
  margin: 0 auto;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  color: white;
`;

export const HeaderIcon = styled.div`
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px #00ad4e solid;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
`;

export const HeaderText = styled.div`
  h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
  }
`;

export const OrderId = styled.div`
  font-size: 14px;
  opacity: 0.9;
  margin-top: 4px;
  color: #00ad4e;
  font-weight: bold;
`;

export const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h2`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0 0 20px 0;
`;

export const PartCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 18px 20px;
  border: 2px solid #f0f0f0;
  border-radius: 14px;
  margin-bottom: 14px;
  background: #ffffff;
  transition: all 0.25s ease;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: #00ad4e;
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.15);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 14px;
  }
`;

export const PartLeft = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  align-items: center;

  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

export const PartRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  min-width: 180px;
  gap: 8px;

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-width: auto;
  }
`;

export const StockWarning = styled.p`
  color: #d32f2f;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 600;
`;

export const PartImage = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #f0f0f0;

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

export const PartInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const PartName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

export const TechInfo = styled.div`
  font-size: 12px;
  color: #999;
  font-weight: 500;
`;

export const PriceRow = styled.div`
  display: flex;
  gap: 16px;
`;

export const PriceItem = styled.div`
  display: flex;
  gap: 4px;
  align-items: baseline;
`;

export const Label = styled.span`
  font-size: 11px;
  color: #999;
  font-weight: 600;
`;

export const Value = styled.span`
  font-size: 13px;
  color: #000000;
  font-weight: 600;
`;

export const QuantitySection = styled.div`
  /* display: flex; */
  justify-content: center;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    justify-content: flex-start;
  }
`;

export const QuantityDisplay = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #f8f9fa;
  border-radius: 8px;
`;

export const QuantityLabel = styled.div`
  font-size: 10px;
  color: #999;
  text-transform: uppercase;
  font-weight: 600;
`;

export const QuantityValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #00ad4e;
`;

export const QuantityEdit = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .ant-input-number {
    width: 80px;
  }
`;

export const IconButton = styled.button`
  width: 30px;
  height: 30px;
  border: none;
  background: #00ad4e;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;

  &:hover {
    transform: scale(1.1);
  }

  &.danger {
    background: #dc3545;
  }
`;

export const PartTotal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    align-items: flex-start;
  }
`;

export const TotalLabel = styled.div`
  font-size: 10px;
  color: #999;
  text-transform: uppercase;
  font-weight: 600;
`;

export const TotalValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #00ad4e;
`;

export const SummaryTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0 0 20px 0;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 15px;
  color: #666;

  span:last-child {
    font-weight: 600;
    color: #333;
  }
`;

export const Divider = styled.div`
  height: 2px;
  background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
  margin: 12px 0;
`;

export const TotalRow = styled(SummaryRow)`
  font-size: 20px;
  font-weight: 700;
  padding: 16px 0 20px 0;

  span:first-child {
    color: #333;
  }

  span:last-child {
    color: #00ad4e;
  }
`;

export const ActionButton = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  button:nth-child(1) {
    color: #e01919;
    background-color: white;
    border: 2px #e01919 solid;
  }
`;

export const ConfirmButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  border: none;
  background-color: #00ad4e;
  color: white;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  font-family: "Outfit", sans-serif;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(10, 130, 64, 0.5);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const TechnicianHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #00ad4e;
  margin-bottom: 20px;

  h2 {
    margin: 0;
  }
`;

export const TechnicianList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TechnicianItem = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border: 2px solid #f0f0f0;
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ad4e;
    background: #f8f9ff;
  }
`;

export const TechAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0e0e0;
`;

export const TechDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const TechName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #333;
`;

export const TechId = styled.div`
  font-size: 12px;
  color: #999;
  font-weight: 500;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  border: 1px solid;
  white-space: nowrap;

  ${(props) => {
    switch (props.$status) {
      case "Available":
        return `
          background: #e8f5e9;
          color: #2e7d32;
          border-color: #a5d6a7;
        `;
      case "Busy":
        return `
          background: #fff3e0;
          color: #e65100;
          border-color: #ffcc80;
        `;
      case "OnLeave":
        return `
          background: #f5f5f5;
          color: #616161;
          border-color: #e0e0e0;
        `;
      default:
        return `
          background: #f5f5f5;
          color: #616161;
          border-color: #e0e0e0;
        `;
    }
  }}
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #999;

  p {
    margin-top: 12px;
    font-size: 14px;
  }
`;
