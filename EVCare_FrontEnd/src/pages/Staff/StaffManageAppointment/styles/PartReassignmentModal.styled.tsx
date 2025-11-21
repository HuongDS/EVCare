import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.25s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  width: 95%;
  max-width: 850px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 173, 78, 0.15);
  animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  font-family: "Outfit", sans-serif;

  @keyframes slideUp {
    from {
      transform: translateY(30px) scale(0.95);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    width: 95%;
    max-height: 95vh;
    border-radius: 12px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  background: linear-gradient(
    135deg,
    rgba(59, 246, 149, 0.5) 0%,
    rgba(44, 226, 117, 0.5) 100%
  );
  color: white;

  @media (max-width: 768px) {
    padding: 20px 24px;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #00ad4e;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.3px;

  svg {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }

  @media (max-width: 768px) {
    font-size: 18px;
    gap: 10px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  cursor: pointer;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: white;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }

  &:active {
    transform: rotate(90deg) scale(0.95);
  }

  @media (max-width: 768px) {
    padding: 8px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export const ModalContent = styled.div`
  padding: 28px;
  overflow-y: auto;
  flex: 1;
  background: #fafbfc;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f3f5;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #00ad4e;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #009944;
  }

  @media (max-width: 768px) {
    padding: 20px 16px;

    &::-webkit-scrollbar {
      width: 6px;
    }
  }
`;

export const WarningBanner = styled.div`
  background: linear-gradient(135deg, #fff9f0 0%, #fff5e6 100%);
  border: 2px solid #ffd699;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 24px;
  color: #8b5a00;
  font-size: 14px;
  line-height: 1.6;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.08);

  svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: #ff9800;
  }

  strong {
    color: #663c00;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    padding: 14px;
    font-size: 13px;
    gap: 10px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

export const PartsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 14px;
  }
`;

export const PartItem = styled.div`
  background: #ffffff;
  border: 1.5px solid #e8f5ee;
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  transition: all 0.25s ease-in-out;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);

  &:hover {
    border-color: #00ad4e;
    box-shadow: 0 6px 20px rgba(0, 173, 78, 0.15);
    transform: translateY(-3px);
  }

  @media (max-width: 1024px) {
    padding: 20px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const PartInfo = styled.div`
  padding-bottom: 12px;
  border-bottom: 1px dashed #e8f5ee;

  @media (max-width: 768px) {
    padding-bottom: 8px;
  }
`;

export const PartName = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 6px 0;
  letter-spacing: -0.3px;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 15px;
    gap: 6px;
  }
`;

export const CurrentTechInfo = styled.p`
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.5;

  strong {
    color: #00ad4e;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  z-index: 5;
`;

export const SelectLabel = styled.label`
  font-size: 12px;
  font-weight: 700;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

export const PartAssignmentBlock = styled.div`
  position: relative;
  width: 100%;
`;

export const TechSearchWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  transition: all 0.3s;

  &:focus-within {
    border-color: #00ad4e;
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.1);
  }

  svg {
    color: #999;
    margin-right: 10px;
    flex-shrink: 0;
  }
`;

export const TechSearchInput = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
  color: #1a1a1a;
  font-family: "Outfit", sans-serif;
`;

export const TechSearchResult = styled.div`
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  margin-top: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  max-height: 332px;
  overflow-y: auto;
  z-index: 20;
  padding: 4px 0;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background: #e4f3eb;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #b1e6c9;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #00ad4e;
  }

  & > div {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    gap: 12px;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: #f0fff6;
    }
  }
`;

export const AssignmentPill = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px 8px 8px;
  background: linear-gradient(135deg, #e8f5ee 0%, #d4f4e3 100%);
  border: 2px solid #00ad4e;
  border-radius: 10px;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

export const AssignmentDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const RemoveAssignmentButton = styled.button`
  background: #f44336;
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;

  &:hover {
    background: #c2392c;
  }
`;

export const TechnicianCardDetail = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const CardLeft = styled.div`
  width: 60%;
  display: flex;
  align-items: center;
  gap: 3%;
`;

export const TechAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

export const TechDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const TechName = styled.span<{ $selected: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: -0.2px;
`;

export const KPI = styled.span<{ $selected: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: #00ad4e;
  letter-spacing: -0.2px;
`;

export const TechStatus = styled.span<{ $statusColor: string }>`
  font-size: 12px;
  color: ${(props) => props.$statusColor};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

export const NoTechniciansMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%);
  border: 2px solid #ffcccc;
  border-radius: 10px;
  color: #c41e3a;
  font-size: 13px;
  font-weight: 600;

  svg {
    flex-shrink: 0;
  }

  &.success-message {
    background: #e8f5ee;
    color: #00ad4e;
    border: 1px solid #00ad4e55;
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
    font-size: 12px;
    gap: 6px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 28px;
  border-top: 2px solid #e8f5ee;
  background: white;

  @media (max-width: 768px) {
    padding: 16px 20px;
    gap: 10px;
    flex-direction: column-reverse;
  }
`;

export const CancelButton = styled.button`
  padding: 12px 24px;
  border: 2px solid #e0e0e0;
  background: white;
  color: #666;
  font-size: 14px;
  font-weight: 700;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.3px;
  font-family: "Outfit", sans-serif;

  &:hover:not(:disabled) {
    border-color: #b8b8b8;
    color: #1a1a1a;
    background: #fafbfc;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 13px;
    width: 100%;
  }
`;

export const ConfirmButton = styled.button`
  padding: 12px 28px;
  border: none;
  background: linear-gradient(135deg, #00ad4e 0%, #00c957 100%);
  color: white;
  font-size: 14px;
  font-weight: 700;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 2px 12px rgba(0, 173, 78, 0.3);
  letter-spacing: 0.3px;
  font-family: "Outfit", sans-serif;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #009944 0%, #00b84c 100%);
    box-shadow: 0 4px 16px rgba(0, 173, 78, 0.4);
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(0, 173, 78, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 13px;
    width: 100%;
  }
`;
