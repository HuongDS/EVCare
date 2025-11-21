import styled from "styled-components";
import { Box, Typography, IconButton } from "@mui/material";

export const StyledBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 420px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 30px rgba(0, 173, 78, 0.25);
  padding: 32px 24px;
  outline: none;
  font-family: "Outfit", sans-serif;
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const ProductName = styled(Typography as any)`
  font-family: "Outfit", sans-serif !important;
  font-weight: 700 !important;
  text-align: center;
  font-size: 1.2rem;
  color: #00ad4e;
`;

export const Info = styled.div`
  width: 100%;
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  gap: 10px;
`;

export const PriceQuantity = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  span:first-child {
    font-weight: 600;
    font-size: 1rem;
    color: #222;
  }

  span:last-child {
    font-size: 0.9rem;
    color: #777;
  }
`;

export const QuantityControl = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

export const StyledIconButton = styled(IconButton)`
  border: 1px solid #ccc !important;
  border-radius: 6px !important;
  width: 36px !important;
  height: 36px !important;
  font-size: 18px !important;
  color: #333 !important;
  transition: all 0.25s ease;

  &:hover {
    border-color: #00ad4e !important;
    color: #00ad4e !important;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const QuantityInput = styled.input`
  width: 64px;
  text-align: center;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 6px 0;
  outline: none;
  transition: border-color 0.25s ease;

  &:focus {
    border-color: #00ad4e;
  }
`;
