import styled from "styled-components";

export const ModalContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 92%;
  max-width: 1000px;
  min-height: 90vh;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 173, 78, 0.2);
  display: flex;
  flex-direction: column;
  font-family: "Outfit", sans-serif;
  overflow: hidden;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%);
  border-bottom: 2px solid #e8f5e9;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const CartIcon = styled.div`
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #00ad4e 0%, #00c853 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.3);
`;

export const HeaderText = styled.div``;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #00ad4e;
  margin: 0 0 4px 0;
`;

export const ItemCount = styled.div`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

export const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: white;
  color: #666;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: #f5f5f5;
    color: #00ad4e;
  }
`;

export const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  padding: 24px;
  overflow-y: auto;
  max-height: calc(90vh - 120px);

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

export const CartSection = styled.div``;

export const CartList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const CartItem = styled.div`
  background: white;
  border: 2px solid #e8f5e9;
  border-radius: 12px;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ad4e;
    box-shadow: 0 4px 12px rgba(0, 173, 78, 0.1);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ItemInfo = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const PartName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #333;
`;

export const PartPrice = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #666;
`;

export const ItemControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

export const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 4px;
`;

export const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  color: #00ad4e;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #e8f5e9;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const QuantityDisplay = styled.div`
  min-width: 32px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #333;
`;

export const DamageSelect = styled.select<{ $color: string }>`
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: ${(props) => props.$color};
  color: white;
  font-size: 13px;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
  }

  option {
    background: white;
    color: #333;
  }
`;

export const DeleteButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: #ffebee;
  color: #f44336;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: #f44336;
    color: white;
  }
`;

export const ItemTotal = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #00ad4e;
  white-space: nowrap;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    text-align: right;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;

  svg {
    color: #00ad4e;
    margin-bottom: 20px;
  }
`;

export const EmptyText = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
`;

export const EmptyHint = styled.div`
  font-size: 14px;
  color: #666;
`;

export const SummarySection = styled.div`
  @media (max-width: 968px) {
    position: sticky;
    bottom: 0;
    background: white;
    padding-top: 20px;
    border-top: 2px solid #e8f5e9;
  }
`;

export const SummaryCard = styled.div`
  background: linear-gradient(135deg, #f8fdf9 0%, #e8f5e9 100%);
  border: 2px solid #c8e6c9;
  border-radius: 16px;
  padding: 24px;
  position: sticky;
  top: 0;
`;

export const SummaryTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #00ad4e;
  margin: 0 0 20px 0;
`;

export const SummaryItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

export const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`;

export const ItemName = styled.div`
  color: #666;
  font-weight: 500;
  flex: 1;
`;

export const Quantity = styled.span`
  color: #00ad4e;
  font-weight: 600;
  margin-left: 6px;
`;

export const ItemAmount = styled.div`
  color: #333;
  font-weight: 600;
`;

export const Divider = styled.div`
  height: 2px;
  background: linear-gradient(90deg, transparent, #c8e6c9, transparent);
  margin: 16px 0;
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const TotalLabel = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #333;
`;

export const TotalAmount = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #00ad4e;
`;

export const ActionButton = styled.button<{ $processing: boolean }>`
  width: 100%;
  padding: 16px;
  border: none;
  background: ${(props) =>
    props.$processing
      ? "#e0e0e0"
      : "linear-gradient(135deg, #00ad4e 0%, #00c853 100%)"};
  color: ${(props) => (props.$processing ? "#9e9e9e" : "white")};
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  font-family: "Outfit", sans-serif;
  cursor: ${(props) => (props.$processing ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    props.$processing ? "none" : "0 4px 12px rgba(0, 173, 78, 0.3)"};

  &:hover {
    ${(props) =>
      !props.$processing &&
      `
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 173, 78, 0.4);
    `}
  }

  &:active {
    transform: translateY(0);
  }
`;
