import styled from "styled-components";
import { motion } from "framer-motion";

export const PageWrapper = styled(motion.div)`
  width: 100%;
  min-height: calc(100vh - 80px);
  padding: 32px;
  background: linear-gradient(135deg, #f0f9f4 0%, #e6f7f0 100%);
  font-family: "Outfit", sans-serif;
`;

export const ContentWrapper = styled.main`
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const Title = styled(motion.h1)`
  font-size: 2.25rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  background: linear-gradient(90deg, #00c656 0%, #00ad4e 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

export const Instruction = styled(motion.p)`
  font-size: 1rem;
  color: #374151;
  margin: 0;
  text-align: center;
`;

export const FilterBar = styled(motion.div)`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #00ad4e;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.2);
  }
`;

export const SortButton = styled.button`
  padding: 12px 16px;
  font-family: "Outfit", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.7);
  color: #1f2937;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;

  &:hover {
    border-color: #00ad4e;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.2);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const AppointmentList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 16px;
`;

export const StatusFilterTabs = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  padding: 5px;
  border: 1px solid rgba(255, 255, 255, 0.5);
`;

export const TabButton = styled.button<{ $isActive: boolean }>`
  font-family: "Outfit", sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: ${({ $isActive }) => ($isActive ? "#fff" : "#374151")};
  background: ${({ $isActive }) => ($isActive ? "linear-gradient(135deg, #00ad4e 0%, #00c853 100%)" : "transparent")};
  box-shadow: ${({ $isActive }) => ($isActive ? "0 4px 12px rgba(0, 173, 78, 0.3)" : "none")};
  transition: all 0.3s ease;

  &:hover:not(:disabled):not(:active) {
    ${({ $isActive }) =>
      !$isActive &&
      `
      background: rgba(0, 0, 0, 0.05);
      color: #000;
    `}
  }
`;
