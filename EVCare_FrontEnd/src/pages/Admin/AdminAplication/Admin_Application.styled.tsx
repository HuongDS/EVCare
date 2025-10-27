import styled, { css, keyframes } from "styled-components";
import { ApplicationStatusEnum } from "../../../models/enums/ApplicationStatusEnum";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scaleIn = keyframes`
  from { 
    opacity: 0;
    transform: scale(0.95); 
  }
  to { 
    opacity: 1;
    transform: scale(1); 
  }
`;

export const GlassContainer = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

export const PageWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 80px);
  padding: 32px;
  background: linear-gradient(135deg, #f0f9f4 0%, #e6f7f0 100%);
  box-sizing: border-box;
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #555;
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

export const RequestTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: transparent;
  table-layout: fixed;

  th,
  td {
    padding: 1rem 1.25rem;
    text-align: left;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    word-wrap: break-word;
  }

  th {
    color: #555;
    font-size: 0.9rem;
    text-transform: uppercase;
  }

  th:nth-child(1) {
    width: 10%;
  }
  th:nth-child(3) {
    width: 30%;
  }

  th:nth-child(2),
  th:nth-child(4),
  th:nth-child(5),
  th:nth-child(6) {
    width: 15%;
  }

  tbody tr {
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
    &:hover {
      background-color: rgba(255, 255, 255, 0.5);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
    }
  }
`;

export const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: start;

  & > :nth-child(1) {
    flex: 1;
    min-width: 250px;
  }
  & > :nth-child(2),
  & > :nth-child(3) {
    min-width: 200px;
  }
`;

export const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 47px;
  padding: 12px 20px 12px 50px;
  font-size: 1rem;
  color: #1f2937;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  box-sizing: border-box;

  &::placeholder {
    color: #6b7280;
  }

  &:focus {
    outline: none;
    border-color: #00ad4e;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.2);
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 1.1rem;
  pointer-events: none;
`;

export const FilterBarItem = styled.div`
  min-width: 200px;

  .ant-select {
    width: 100%;
  }
  .ant-select-selector {
    padding: 8px 16px !important;
    height: 47px !important;
    font-size: 1rem !important;
    color: #1f2937 !important;
    border-radius: 12px !important;
    border: 1px solid rgba(255, 255, 255, 0.5) !important;
    background: rgba(255, 255, 255, 0.7) !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
    transition: all 0.3s ease !important;
  }
  .ant-select-selection-placeholder {
    color: #6b7280 !important;
    line-height: 29px !important;
  }
  .ant-select-focused .ant-select-selector {
    border-color: #00ad4e !important;
    background: rgba(255, 255, 255, 1) !important;
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.2) !important;
  }

  .ant-picker-range {
    width: 100%;
    padding: 8px 16px !important;
    height: 47px !important;
    font-size: 1rem !important;
    border-radius: 12px !important;
    border: 1px solid rgba(255, 255, 255, 0.5) !important;
    background: rgba(255, 255, 255, 0.7) !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
    transition: all 0.3s ease !important;
  }
  .ant-picker-range .ant-picker-input > input {
    font-size: 1rem !important;
  }
  .ant-picker-range .ant-picker-input > input::placeholder {
    color: #6b7280 !important;
  }
  .ant-picker-focused {
    border-color: #00ad4e !important;
    background: rgba(255, 255, 255, 1) !important;
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.2) !important;
  }
`;

export const ReasonCell = styled.td`
  color: #555;
`;

interface StatusBadgeProps {
  status: ApplicationStatusEnum;
}
export const StatusBadge = styled.span<StatusBadgeProps>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid;

  ${({ status }) => {
    switch (status) {
      case ApplicationStatusEnum.PENDING:
        return css`
          background-color: #fffbe6;
          color: #f59e0b;
          border-color: #fde68a;
        `;
      case ApplicationStatusEnum.APPROVED:
        return css`
          background-color: #f0fdf4;
          color: #16a34a;
          border-color: #bbf7d0;
        `;
      case ApplicationStatusEnum.REJECTED:
        return css`
          background-color: #fef2f2;
          color: #dc2626;
          border-color: #fecaca;
        `;
    }
  }}
`;

const BaseButton = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ViewButton = styled(BaseButton)`
  background: transparent;
  border: 1px solid #00ad4e;
  color: #00ad4e;

  &:hover {
    background: #00ad4e;
    color: #fff;
    box-shadow: 0 4px 15px -5px #00ad4e;
  }
`;

export const ApproveButton = styled(BaseButton)`
  background: linear-gradient(90deg, #00ad4e, #00c95e);
  color: #fff;

  &:hover {
    opacity: 0.9;
    box-shadow: 0 4px 20px -5px #00ad4e;
    transform: translateY(-2px);
  }
`;

export const DenyButton = styled(BaseButton)`
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;

  &:hover {
    background: #dc2626;
    color: #fff;
  }
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
`;

// Kế thừa style từ GlassContainer
export const ModalContent = styled(GlassContainer)`
  position: relative;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${scaleIn} 0.3s ease;
`;

export const ModalCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  background: transparent;
  border: none;
  font-size: 2rem;
  color: #555;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #222;
  }
`;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ModalColumn = styled.div`
  flex: 1;
`;

export const EmployeeInfo = styled(ModalColumn)`
  text-align: center;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  padding-right: 2rem;

  @media (max-width: 768px) {
    // Responsive
    border-right: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    padding-right: 0;
    padding-bottom: 2rem;
  }

  strong {
    font-size: 1.2rem;
    display: block;
  }

  p {
    font-size: 0.95rem;
    color: #555;
    margin: 0.3rem 0;
  }
`;

export const EmployeeAvatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #00ad4e;
  margin: 1rem auto;
`;

export const RequestInfo = styled(ModalColumn)`
  h4 {
    margin-top: 0;
  }
`;

export const ReasonBox = styled.div<{ $isNote?: boolean }>`
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 1rem;
  min-height: 100px;
  max-width: 400px;
  max-height: 600px;
  overflow-y: auto;
  white-space: pre-wrap;
  color: ${({ $isNote }) => ($isNote ? "#555" : "#222")};
  font-style: ${({ $isNote }) => ($isNote ? "italic" : "normal")};
`;

export const ActionForm = styled.div`
  margin-top: 1.5rem;
`;

export const NoteTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.75rem;
  font-family: inherit;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #00ad4e;
    box-shadow: 0 0 0 2px rgba(0, 173, 78, 0.2);
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

export const InfoTable = styled.table`
  width: 100%;
  text-align: left;
  margin-top: 1rem;
  border-collapse: collapse;

  tr {
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }

  td {
    padding: 8px 0;
  }

  td:first-child {
    font-weight: 600;
    color: #333;
    width: 110px;
  }
`;
