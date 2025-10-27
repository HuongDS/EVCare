import styled, { css, keyframes } from "styled-components";
import { motion } from "framer-motion";

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

const commonInputStyles = css`
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

export const StyledSelect = styled.select`
  ${commonInputStyles}
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
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

export const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f8f9fa;
`;

export const Header = styled.header`
  margin-bottom: 1.5rem;
`;

export const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #065f46;
  margin: 0;
`;

export const Instruction = styled.p`
  font-size: 1rem;
  color: #4b5563;
  margin-top: 0.25rem;
`;

export const MainTabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

export const MainTabButton = styled.button<{ $isActive: boolean }>`
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ $isActive }) =>
    $isActive
      ? css`
          background: #00ad4e;
          color: white;
          box-shadow: 0 4px 12px rgba(0, 173, 78, 0.2);
        `
      : css`
          background: #fff;
          color: #374151;
          border: 1px solid #d1d5db;
          &:hover {
            background: #f9fafb;
            color: #1f2937;
          }
        `}
`;

export const ManagerWrapper = styled(motion.div)`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
`;

export const SubTabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #e5e7eb;
  padding: 0 1.5rem;
`;

export const SubTabButton = styled.button<{ $isActive: boolean }>`
  padding: 1rem 0.5rem;
  margin-right: 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  bottom: -2px;
  border-bottom: 3px solid transparent;

  &:hover {
    color: #065f46;
  }

  ${({ $isActive }) =>
    $isActive &&
    css`
      color: #065f46;
      border-bottom-color: #00ad4e;
    `}
`;

export const TabContent = styled(motion.div)`
  padding: 1.5rem 2rem;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

export const Th = styled.th`
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const Td = styled.td`
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 16px;
  color: #4b5563;
  vertical-align: middle;
`;

export const Tr = styled.tr<{ $isDeleted?: boolean; $isActive?: boolean }>`
  &:last-child {
    ${Td} {
      border-bottom: none;
    }
  }

  ${({ $isDeleted }) =>
    $isDeleted &&
    css`
      background: #fef2f2;
      ${Td} {
        color: #9ca3af;
        text-decoration: line-through;
      }
    `}

  ${({ $isActive }) =>
    $isActive === false &&
    css`
      background: #f3f4f6;
      ${Td} {
        color: #9ca3af;
      }
    `}
`;

export const StatusBadge = styled.span<{ $isActive: boolean }>`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 99px;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;

  ${({ $isActive }) =>
    $isActive
      ? css`
          background: #dcfce7;
          color: #166534;
        `
      : css`
          background: #f1f5f9;
          color: #475569;
        `}
`;

export const ActionButton = styled.button<{ $isDelete?: boolean }>`
  background: none;
  border: none;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  color: ${({ $isDelete }) => ($isDelete ? "#dc2626" : "#00ad4e")};

  &:hover:not(:disabled) {
    background: ${({ $isDelete }) => ($isDelete ? "#fee2e2" : "#dcfce7")};
  }

  &:disabled {
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const FormWrapper = styled(motion.form)`
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

export const SubmitButton = styled.button`
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
  background: #00ad4e;
  color: white;

  &:hover:not(:disabled) {
    background: #008f3f;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FileUploadWrapper = styled.div`
  ${commonInputStyles}
  padding: 0;
  cursor: pointer;
  display: flex;

  input[type="file"] {
    display: none;
  }

  label {
    padding: 10px 14px;
    width: 100%;
    cursor: pointer;
    color: #6b7280;

    span {
      font-weight: 600;
      color: #00ad4e;
    }
  }

  &.file-chosen {
    label {
      color: #374151;
    }
  }

  &:hover {
    border-color: #00ad4e;
  }
`;

export const MultiSelectWrapper = styled.div`
  ${commonInputStyles}
  min-height: 150px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;

  .placeholder {
    color: #9ca3af;
    font-style: italic;
  }

  .selected-item {
    background: #e0f2fe;
    color: #0369a1;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 500;
  }
`;
