import styled from "styled-components";
import { Typography, Button } from "@mui/material";

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const ProductName = styled(Typography)`
  font-weight: 600;
  text-align: center;
`;

export const Info = styled.div`
  width: 100%;
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
`;

export const PriceQuantity = styled.div`
  display: flex;
  flex-direction: column;

  span:first-child {
    font-weight: 600;
  }

  span:last-child {
    font-size: 14px;
    color: #555;
  }
`;

export const AddToCartButton = styled(Button)`
  background-color: #00a859;
  color: white;
  text-transform: none;
  padding: 4px 12px;
  font-weight: 600;
  font-size: 0.875rem;

  &:hover {
    background-color: #00994f;
  }
`;

export const QuantityControl = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

export const QuantityNumber = styled.span`
  min-width: 24px;
  text-align: center;
  font-size: 1rem;
`;
