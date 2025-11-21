import styled from "styled-components";
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
  .search-bar {
    position: relative;
    width: 100%;

    .search-input {
      width: 100%;
      padding: 12px 20px 12px 50px;
      font-size: 1rem;
      font-family: "Outfit", sans-serif;
      color: #1f2937;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: #00ad4e;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.2);
      }
    }

    .search-icon {
      position: absolute;
      top: 50%;
      left: 20px;
      transform: translateY(-50%);
      color: #6b7280;
      font-size: 1.1rem;
    }
  }
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

export const TabContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.05);
`;

export const TabButton = styled.button<{ $isActive: boolean }>`
  flex: 1;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  background: ${({ $isActive }) => ($isActive ? "#00ad4e" : "transparent")};
  color: ${({ $isActive }) => ($isActive ? "#fff" : "#374151")};
  box-shadow: ${({ $isActive }) => ($isActive ? "0 4px 12px rgba(0, 173, 78, 0.3)" : "none")};

  &:hover:not(:disabled) {
    background: ${({ $isActive }) => ($isActive ? "#008f3f" : "rgba(0, 173, 78, 0.1)")};
  }
`;

export const TabContent = styled.div`
  width: 100%;
  overflow: hidden;
`;

export const FormWrapper = styled(motion.form)`
  padding: 32px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
`;

export const FormGrid = styled.div<{ $isNested?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isNested }) => ($isNested ? "1fr 1fr" : "1fr 1fr")};
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
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
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.8);
  color: #1f2937;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ad4e;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.2);
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
`;

export const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: "Outfit", sans-serif;
  color: #fff;
  background: #00ad4e;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 32px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.3);

  &:hover {
    background: #008f3f;
    box-shadow: 0 6px 16px rgba(0, 173, 78, 0.4);
    transform: translateY(-2px);
  }
`;

export const DraggerWrapper = styled.div`
  .ant-upload.ant-upload-drag {
    background: rgba(255, 255, 255, 0.8);
    border: 2px dashed #00ad4e;
    border-radius: 10px;
    padding: 24px;
    transition: all 0.3s ease;

    &:hover {
      border-color: #008f3f;
      background: rgba(255, 255, 255, 1);
    }
  }

  .ant-upload-text {
    font-family: "Outfit", sans-serif;
    color: #374151;
    font-weight: 500;
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

  &:nth-child(1) {
    width: 10%;
  &:nth-child(2) {
    width: 25%;
  &:nth-child(3) {
    width: 15%;
  &:nth-child(4) {
    width: 15%;
  &:nth-child(5) {
    width: 15%;
  &:nth-child(6) {
    width: 10%;
  &:nth-child(7) {
    width: 10%;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Tr = styled.tr`
  border-bottom: 1px solid rgba(0, 173, 78, 0.1);
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: rgba(0, 173, 78, 0.05);
  }
`;

export const Td = styled.td`
  padding: 12px 20px;
  vertical-align: middle;
  font-size: 0.95rem;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:last-child {
    display: flex;
    gap: 8px;
    overflow: visible;
    white-space: normal;
  }
`;

export const PartImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

export const ActionButton = styled.button`
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

export const UpdateButton = styled(ActionButton)`
  color: #065f46;
  background: #dcfce7;
  border: 1px solid #dcfce7;

  &:hover:not(:disabled) {
    background: #bbf7d0;
    color: #064e3b;
    border-color: #86efac;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
`;

export const CancelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: "Outfit", sans-serif;
  color: #00ad4e;
  background: #fdfdfdff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 32px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.3);

  &:hover {
    background: #c2c2c281;
    box-shadow: 0 6px 16px rgba(0, 173, 78, 0.4);
    transform: translateY(-2px);
  }
`;
