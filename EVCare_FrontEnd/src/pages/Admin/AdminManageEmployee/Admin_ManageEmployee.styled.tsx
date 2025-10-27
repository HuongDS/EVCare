import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import { EmployeeStatusEnum, RoleEnum } from "../../../models/enums";

export const PageWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 80px);
  padding: 32px;
  background: linear-gradient(135deg, #f0f9f4 0%, #e6f7f0 100%);
`;

export const ContentWrapper = styled.main`
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  .filter-bar {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    padding: 20px;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 16px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.05);
  }

  .search-input,
  .filter-select {
    font-family: "Outfit", sans-serif;
    font-size: 1rem;
    padding: 12px 16px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.7);
    color: #1f2937;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #00ad4e;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.2);
    }
  }

  .search-input {
    flex: 1;
    min-width: 300px;
  }

  .filter-select {
    min-width: 180px;
    cursor: pointer;
  }

  .main-content {
    padding: 0;
  }
  .page-wrapper {
    width: 100%;
  }

  .add-employee-btn {
    padding: 12px 24px;
    background: #00ad4e;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: "Outfit", sans-serif;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-left: auto;
  }

  .add-employee-btn:hover {
    background: #008f3f;
  }
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-bottom: 24px;
  // border-bottom: none;
  margin-bottom: 24px;
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

export const EmployeesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
`;

export const CardWrapper = styled.div<{ $isBanned: boolean }>`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  opacity: ${({ $isBanned }) => ($isBanned ? 0.6 : 1)};
  filter: ${({ $isBanned }) => ($isBanned ? "grayscale(80%)" : "none")};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.12);
  }
`;

export const header = styled.div`
  display: flex;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 173, 78, 0.1);
  margin-bottom: 16px;
`;

export const Avatar = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
`;

export const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 0;
  text-align: center;
`;

export const NameRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const Name = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

export const RoleBadge = styled.span<{ $role: RoleEnum }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${({ $role }) => ($role === RoleEnum.TECHNICIAN ? "rgba(0, 173, 78, 0.15)" : "#e0f2fe")};
  color: ${({ $role }) => ($role === RoleEnum.TECHNICIAN ? "#065f46" : "#0c4a6e")};
`;

export const BannedBadge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  background: #f3f4f6;
  color: #6b7280;
`;

export const StatusBadge = styled.div<{ $status: EmployeeStatusEnum }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  width: fit-content;
  margin-top: 4px;
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
  }

  ${({ $status }) => {
    switch ($status) {
      case EmployeeStatusEnum.Available:
        return `background: #dcfce7; color: #166534;`;
      case EmployeeStatusEnum.Busy:
        return `background: #fffbeb; color: #b45309;`;
      case EmployeeStatusEnum.OnLeave:
        return `background: #f3f4f6; color: #6b7280;`;
      default:
        return `background: #f3f4f6; color: #6b7280;`;
    }
  }}
`;

export const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  padding: 0 16px;
`;

export const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.95rem;
  color: #374151;
`;

export const DetailIcon = styled.div`
  font-size: 1.1rem;
  color: #00ad4e;
  width: 24px;
  text-align: center;
`;

export const TechSection = styled.div`
  margin-top: 16px;
  padding-top: 124px;
  padding: 0 16px;
`;

export const SectionTitle = styled.h4`
  font-size: 0.85rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 16px 0;
`;

export const ExperienceBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(0, 173, 78, 0.1);
  color: #064e3b;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 16px;
`;

export const SkillsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-height: 90px;
  overflow-y: auto;
  padding-right: 8px;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.4);
  }
`;

export const SkillTag = styled.span`
  padding: 6px 14px;
  background: #e5e7eb;
  color: #4b5563;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 24px;
`;

export const ActionButton = styled.button`
  padding: 10px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
  background: #fff;
  border: 1px solid #d1d5db;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:hover {
    background: #f9fafb;
    color: #374151;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px;
  color: #6b7280;
  font-size: 1rem;
  grid-column: 1 / -1;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
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
    background: #dc2626; color: white;
    &:hover { background: #b91c1c; }
  `
      : `
    background: #fff; color: #374151;
    border: 1px solid #d1d5db;
    &:hover { background: #f9fafb; }
  `}
`;
