import styled, { keyframes } from "styled-components";
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
  padding: 20px;
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
  color: #4b5563;
  margin-top: 0.25rem;
`;

export const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const SearchIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 1.1rem;
`;

export const SearchInput = styled.input`
  width: 50%;
  padding: 12px 20px 12px 50px;
  font-size: 1rem;
  font-family: "Outfit", sans-serif;
  color: #1f2937;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  transition: all 0.3s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #00ad4e;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.2);
  }
`;

export const TableWrapper = styled.div`
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
`;

export const TBody = styled.tbody``;

export const Tr = styled.tr<{ $isBanned?: boolean; $expandable?: boolean }>`
  border-bottom: 1px solid rgba(0, 173, 78, 0.1);
  transition: background-color 0.2s ease, opacity 0.3s ease;

  opacity: ${({ $isBanned }) => ($isBanned ? 0.5 : 1)};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: rgba(0, 173, 78, 0.05);
  }

  cursor: ${({ $expandable }) => ($expandable ? "pointer" : "default")};
`;

export const Td = styled.td`
  padding: 16px 20px;
  vertical-align: middle;
`;

export const AvatarIconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #00ad4e;
  color: #fff;
  font-size: 1.2rem;

  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const CustomerName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
`;

export const ContactInfo = styled.div`
  font-size: 0.9rem;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    font-size: 0.9rem;
    color: #9ca3af;
  }
`;

export const StatusBadge = styled.span<{ $isBanned: boolean }>`
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: capitalize;
  color: ${({ $isBanned }) => ($isBanned ? "#6b7280" : "#065f46")};
  background-color: ${({ $isBanned }) => ($isBanned ? "#f3f4f6" : "rgba(0, 173, 78, 0.15)")};
`;

export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ActionButton = styled.button<{ $isBanButton?: boolean; $isExpanded?: boolean }>`
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

  ${({ $isBanButton }) =>
    $isBanButton &&
    `
    color: #6b7280; 
    border: 1px solid #d1d5db;
    background: #fff; 
    &:hover:not(:disabled) {
   background: #f9fafb;
     color: #374151;
    }
    &:disabled {
      color: #9ca3af;
      background: #f3f4f6;
      cursor: not-allowed;
    }
  `}

  ${({ $isBanButton, $isExpanded }) =>
    !$isBanButton &&
    `
    color: #4b5563;
    background: rgba(243, 244, 246, 0.8);
    svg {
      transition: transform 0.3s ease;
      transform: rotate(${$isExpanded ? "180deg" : "0deg"});
    }
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

export const ExpandableRow = styled(Tr)`
  &:hover {
    background-color: transparent;
  }
  /* Xóa viền cho đẹp */
  & > td {
    border: none;
    padding: 0;
  }
  opacity: ${({ $isBanned }) => ($isBanned ? 0.5 : 1)} !important;
`;

export const ExpandableContent = styled.div`
  padding: 24px 32px;
  background-color: rgba(0, 173, 78, 0.03);

  h4 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #065f46;
    margin: 0 0 16px 0;
  }
`;

export const VehicleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

export const VehicleCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
`;

export const VehicleImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
`;

export const VehicleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    font-size: 1rem;
    font-weight: 700;
    color: #1f2937;
  }
  span {
    font-size: 0.9rem;
    color: #4b5563;
  }
`;

export const EmptyState = styled.div`
  padding: 60px 40px;
  text-align: center;

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 8px 0;
  }
  p {
    font-size: 1rem;
    color: #6b7280;
    margin: 0;
  }
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
