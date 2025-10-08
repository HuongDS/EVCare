import styled from "styled-components";

export const CartContainer = styled.div`
  font-family: "Outfit", sans-serif;
  display: grid;
  grid-template-columns: 2fr 1fr; /* trái: cart list, phải: checkout */
  gap: 24px;
  height: 70vh; /* giữ modal gọn hơn */
`;

export const CartList = styled.div`
  border-right: 1px solid #eee;
  padding-right: 16px;
  display: flex;
  flex-direction: column;

  h2 {
    margin-bottom: 16px;
  }

  /* Tạo vùng cuộn cho danh sách */
  overflow-y: auto;
  max-height: calc(70vh - 60px); /* chừa phần header */
  padding-right: 8px;

  /* Ẩn scrollbar mặc định, tuỳ chọn */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }
`;

export const CheckoutBox = styled.div`
  background: #f8f8f8;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: fit-content;
  max-height: 70vh; /* đảm bảo không bị dài */
  overflow-y: auto;
`;

export const CheckoutHeader = styled.h3`
  margin-bottom: 12px;
  text-align: center;
`;

export const TotalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  h4 {
    margin-bottom: 8px;
  }
`;

export const ProductLine = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #333;
`;

export const TotalLine = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 1rem;
  margin-top: 12px;
  border-top: 1px solid #ddd;
  padding-top: 8px;
`;

export const TotalValue = styled.span`
  font-weight: 700;
  color: #00ad4e;
`;

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

export const Title = styled.h2`
  position: sticky;
  justify-self: center;
  top: 0;
  background: #fff;
  z-index: 10;
  padding: 12px 0;
  margin: 0 0 12px 0;
  border-bottom: 1px solid #eee;
`;
