import styled from "styled-components";

export const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

export const ItemLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const ItemDetails = styled.span`
  font-weight: 600;
  font-size: 1rem;
  color: #222;
`;

export const PriceTag = styled.span`
  font-size: 0.9rem;
  color: #555;
`;

export const ItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const QuantityNumber = styled.span`
  min-width: 24px;
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
`;

export const EmptyCartMessage = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #777;
  margin-top: 20px;
`;
