import { Download } from "lucide-react";
import styled from "styled-components";

interface DownloadButtonProps {
  action: () => void;
}
export const DownloadButton = ({ action }: DownloadButtonProps) => {
  return (
    <PrintButtonWrapper>
      <ButtonContainer>
        <Download />
        <button onClick={action}>Print Invoice</button>
      </ButtonContainer>
    </PrintButtonWrapper>
  );
};

const PrintButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 10px;
`;

const ButtonContainer = styled.div`
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #75e76f 100%);
  color: white;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  font-family: "Outfit", sans-serif;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
  }

  &:active {
    transform: translateY(0);
  }
`;
