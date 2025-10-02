import { Typography } from "@mui/material";
import styled from "styled-components";

export const CardContainer = styled.div`
  font-family: "Outfit", sans-serif;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Image = styled.img`
  width: 80%;
  max-width: 300px;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  margin: 0 auto;
  background-color: #f3f3f3;

  @media (max-width: 600px) {
    height: 120px;
  }
`;

export const ProductName = styled(Typography)`
  font-weight: bold;
  text-align: center;
`;

export const Descriptions = styled(Typography)`
  color: #555;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 120px;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
