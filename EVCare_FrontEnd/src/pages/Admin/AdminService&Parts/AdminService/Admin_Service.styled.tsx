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
    width: 30%;
  }
  &:nth-child(2) {
    width: 35%;
  }
  &:nth-child(3) {
    width: 10%;
  }
  &:nth-child(4) {
    width: 5%;
  }
  &:nth-child(5) {
    width: 20%;
  }
`;

export const Tr = styled.tr<{ $isDeleted?: boolean; $isExpanded?: boolean }>`
  border-bottom: 1px solid rgba(0, 173, 78, 0.1);
  transition: background-color 0.2s ease, opacity 0.3s ease;
  opacity: ${({ $isDeleted }) => ($isDeleted ? 0.5 : 1)};
  filter: ${({ $isDeleted }) => ($isDeleted ? "grayscale(80%)" : "none")};

  &:last-child {
    border-bottom: none;
  }

  &:not(.expanded-row):hover {
    background-color: rgba(0, 173, 78, 0.05);
  }

  &.expanded-row {
    background-color: rgba(0, 173, 78, 0.03);

    + tr:not(.expanded-row) {
      border-top: 1px solid rgba(0, 173, 78, 0.2);
    }
  }
`;

export const Td = styled.td`
  padding: 14px 20px;
  vertical-align: middle;
  font-size: 0.95rem;
  color: #1f2937;
  word-break: break-word;

  tr:not(.expanded-row) &:last-child {
    display: flex;
    gap: 8px;
    align-items: center;
    white-space: nowrap;
  }
`;

export const ExpandedContentCell = styled(Td)`
  padding: 20px 40px;
  background: rgba(240, 253, 244, 0.5);

  h4 {
    font-size: 1rem;
    font-weight: 700;
    color: #065f46;
    margin: 0 0 12px 0;
  }

  p {
    font-size: 0.9rem;
    color: #6b7280;
    font-style: italic;
  }
`;

export const ExpandButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, transform 0.2s ease;
  color: #00ad4e;

  &:hover {
    background-color: rgba(0, 173, 78, 0.1);
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

export const ModalButton = styled.button<{
  $isConfirm: boolean;
  $isDeleteModal?: boolean;
}>`
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
  position: relative;
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

export const StyledSelect = styled.select`
  ${commonInputStyles}
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
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

export const GeneratingOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  color: #00ad4e;
  font-size: 1.5rem;
`;

export const ServiceGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
`;

export const ServiceCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  padding: 12px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
`;

export const ServiceIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-bottom: 8px;
  background: #ecfdf5;
  color: #00ad4e;
  font-size: 1.5rem;
  border: 1px solid #a7f3d0;
`;

export const ServiceName = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
  height: 2.8em;
  overflow: hidden;
`;

export const PartGallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 8px;
`;

export const PartCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 12px;
  text-align: center;
  transition: all 0.3s ease;
  width: 150px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
`;

export const PartImageWrapper = styled.div`
  width: 100%;
  height: 90px;
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const PartName = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
  height: 2.8em;
  overflow: hidden;
`;

export const PartSelectionWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;

  .part-select-group {
    flex: 1;
  }

  .part-add-button {
    flex-shrink: 0;
    height: 48px;
    padding: 0 16px;
    font-size: 0.9rem;
  }
`;

export const PartPillContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 12px;
  min-height: 50px;
  max-height: 120px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }

  .empty-parts-text {
    font-size: 0.9rem;
    color: #9ca3af;
    font-style: italic;
  }
`;

export const PartPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px 4px 4px;
  border-radius: 20px;
  background: #ecfdf5;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
  animation: ${fadeIn} 0.3s ease;

  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const PartPillRemoveButton = styled.button`
  background: #e5e7eb;
  color: #4b5563;
  border: none;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  font-size: 0.7rem;

  &:hover {
    background: #dc2626;
    color: white;
  }
`;
