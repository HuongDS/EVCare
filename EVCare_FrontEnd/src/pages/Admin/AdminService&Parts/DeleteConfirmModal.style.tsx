import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const ModalBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  animation: ${fadeIn} 0.3s ease;
`;

export const ModalContainer = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);
  z-index: 1001;
`;

export const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #c2410c;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
  font-size: 1rem;
  color: #374151;
  line-height: 1.6;

  p {
    margin: 0 0 12px 0;
  }
  strong {
    color: #1f2937;
    font-weight: 700;
  }
`;

export const ModalFooter = styled.div`
  padding: 20px 24px;
  background: rgba(0, 0, 0, 0.03);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

export const ModalButton = styled.button<{ $isConfirm: boolean }>`
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $isConfirm }) =>
    $isConfirm
      ? `
    background: #dc2626; 
    color: white;
    &:hover {
      background: #b91c1c; 
    }
  `
      : `
    background: #fff;
    color: #374151;
    border: 1px solid #d1d5db;
    &:hover {
      background: #f9fafb;
    }
  `}
`;
