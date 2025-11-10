import styled from "styled-components";

const COLORS = {
  primary: "#00ad4e",
  text: "#222",
  textSecondary: "#555",
  border: "#e5e5e5",
  bgLight: "#f9f9f9",
  bgWhite: "#ffffff",
};

export const CartContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  font-family: "Outfit", sans-serif;
  color: ${COLORS.text};
  height: 70vh;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

export const CartList = styled.div`
  background: ${COLORS.bgWhite};
  border: 1px solid ${COLORS.border};
  border-radius: 12px;
  padding: 16px 20px;
  overflow-y: auto;
  max-height: 65vh;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
  }
`;

export const CheckoutBox = styled.div`
  background: ${COLORS.bgLight};
  border-radius: 12px;
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 14px rgba(0, 173, 78, 0.15);
  height: fit-content;
`;

export const CheckoutHeader = styled.h3`
  text-align: center;
  font-weight: 700;
  color: ${COLORS.primary};
  margin-bottom: 16px;
`;

export const TotalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  h4 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 4px;
    color: ${COLORS.text};
  }
`;

export const ProductLine = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: ${COLORS.textSecondary};
`;

export const TotalLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${COLORS.border};
  margin-top: 12px;
  padding-top: 10px;
  font-weight: 600;
  font-size: 1rem;
`;

export const TotalValue = styled.span`
  font-weight: 700;
  color: ${COLORS.primary};
`;

export const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid ${COLORS.border};

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
  color: ${COLORS.text};
`;

export const PriceTag = styled.span`
  font-size: 0.9rem;
  color: ${COLORS.textSecondary};
`;

export const ItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const QuantityNumber = styled.span`
  min-width: 28px;
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  color: ${COLORS.text};
`;

export const EmptyCartMessage = styled.p`
  text-align: center;
  color: ${COLORS.textSecondary};
  font-size: 1rem;
  margin-top: 24px;
`;

export const Title = styled.h2`
  font-family: "Outfit", sans-serif;
  text-align: center;
  font-size: 1.4rem;
  font-weight: 700;
  color: ${COLORS.primary};
  margin-bottom: 20px;
`;
