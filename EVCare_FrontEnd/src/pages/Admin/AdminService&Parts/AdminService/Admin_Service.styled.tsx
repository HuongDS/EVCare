import styled, { keyframes, css } from "styled-components";
import { motion } from "framer-motion";

export const PageWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 80px);
  padding: 32px;
  background: linear-gradient(135deg, #f0f9f4 0%, #e6f7f0 100%);
`;

export const ContentWrapper = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Header = styled.header`
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.05);
`;

export const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  background: linear-gradient(90deg, #00c656 0%, #00ad4e 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

export const Instruction = styled.p`
  font-size: 1rem;
  color: #374151;
  margin: 0;
`;

export const Toolbar = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;

  & > :first-child {
    flex: 1;
    min-width: 300px;
  }
`;

export const AddButton = styled.button`
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  color: #fff;
  background: #00ad4e;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.2);

  &:hover {
    background: #008f3f;
    box-shadow: 0 6px 16px rgba(0, 173, 78, 0.3);
    transform: translateY(-2px);
  }
`;

export const TableWrapper = styled(motion.div)`
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

export const Th = styled.th`
  padding: 16px 20px;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid rgba(0, 173, 78, 0.2);
  white-space: nowrap;

  &:nth-child(1) {
    width: 15%;
  }
  &:nth-child(2) {
    width: 30%;
  }
  &:nth-child(3) {
    width: 15%;
  }
  &:nth-child(4) {
    width: 15%;
  }
  &:nth-child(5) {
    width: 20%;
  }
`;

export const Tr = styled.tr<{ $isDeleted?: boolean }>`
  border-bottom: 1px solid rgba(0, 173, 78, 0.1);
  transition: background-color 0.2s ease, opacity 0.3s ease;
  opacity: ${({ $isDeleted }) => ($isDeleted ? 0.5 : 1)};
  filter: ${({ $isDeleted }) => ($isDeleted ? "grayscale(80%)" : "none")};

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: rgba(0, 173, 78, 0.05);
  }
`;

export const Td = styled.td`
  padding: 14px 20px;
  vertical-align: middle;
  font-size: 0.95rem;
  color: #1f2937;
  white-space: normal;
  word-break: break-word;

  &:last-child {
    display: flex;
    gap: 8px;
    align-items: center;
    white-space: nowrap;
  }
`;

const BaseActionButton = styled.button`
  padding: 8px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #e5e7eb !important;
    color: #9ca3af !important;
    border-color: #d1d5db !important;
  }
`;

export const UpdateButton = styled(BaseActionButton)`
  color: #065f46;
  background: #dcfce7;
  border: 1px solid transparent;

  &:hover:not(:disabled) {
    background: #bbf7d0;
    color: #064e3b;
  }
`;

export const ActionButton = styled(BaseActionButton)`
  color: #6b7280;
  background: #fff;
  border: 1px solid #d1d5db;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:hover:not(:disabled) {
    background: #fef2f2;
    color: #dc2626;
    border-color: #fca5a5;
  }
`;

export const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  font-size: 1rem;
  color: #6b7280;
`;

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
  overflow-y: auto;
`;

export const ModalContainer = styled(motion.div)`
  width: 100%;
  max-width: 650px;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);
  z-index: 1001;
  margin: auto;
`;

export const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalTitle = styled.h3<{ $isDeleteModal?: boolean }>`
  font-size: 1.35rem;
  font-weight: 700;
  color: #065f46;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;

  ${({ $isDeleteModal }) =>
    $isDeleteModal &&
    css`
      color: #c2410c;
    `}
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
  display: flex;
  flex-direction: column;
  gap: 16px;

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

export const ModalButton = styled.button<{ $isConfirm: boolean; $isDeleteModal?: boolean }>`
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ $isConfirm, $isDeleteModal }) =>
    $isConfirm
      ? css`
          background: ${$isDeleteModal ? "#dc2626" : "#00ad4e"};
          color: white;
          &:hover:not(:disabled) {
            background: ${$isDeleteModal ? "#b91c1c" : "#008f3f"};
          }
        `
      : css`
          background: #fff;
          color: #374151;
          border: 1px solid #d1d5db;
          &:hover:not(:disabled) {
            background: #f9fafb;
          }
        `}
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const StyledLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
`;

const commonInputStyles = `
  font-family: "Outfit", sans-serif;
  font-size: 1rem;
  padding: 10px 14px; 
  border-radius: 8px;
  border: 1px solid #d1d5db; 
  background: #fff; 
  color: #1f2937;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ad4e;
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.2);
  }

  &:disabled {
      background: #f3f4f6;
      cursor: not-allowed;
  }
`;

export const StyledInput = styled.input`
  ${commonInputStyles}
`;

export const StyledTextArea = styled.textarea`
  ${commonInputStyles}
  resize: vertical;
  min-height: 100px;
`;

export const GenerateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  color: #065f46;
  background: #dcfce7;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  margin-top: -4px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
  width: fit-content;

  svg {
    font-size: 0.9rem;
  }

  &:hover:not(:disabled) {
    background: #bbf7d0;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #e5e7eb;
    color: #9ca3af;
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;
