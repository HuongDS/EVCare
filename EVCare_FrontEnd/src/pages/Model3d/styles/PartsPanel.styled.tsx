import { ChevronRight, Zap } from "lucide-react";
import styled, { css, keyframes } from "styled-components";

export const pulseGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 5px rgba(34, 197, 94, 0.5), 0 0 10px rgba(34, 197, 94, 0.3);
  }
  50% { 
    box-shadow: 0 0 10px rgba(34, 197, 94, 0.8), 0 0 20px rgba(34, 197, 94, 0.5);
  }
`;

export const slideIn = keyframes`
  from { 
    transform: translateX(-20px); 
    opacity: 0; 
  }
  to { 
    transform: translateX(0); 
    opacity: 1; 
  }
`;

// Styled Components
export const Container = styled.div`
  height: 100%;
  background: rgba(19, 241, 156, 0.2);
  color: #f0fdf4;
  position: relative;
  overflow-y: auto;
  backdrop-filter: blur(8px);
  font-family: "Outfit", sans-serif;
`;

export const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  padding: 0.5rem;
  border-bottom: 1px solid rgba(34, 197, 94, 0.3);
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(10px) saturate(120%);
  box-shadow: inset 0 -1px 0 rgba(34, 197, 94, 0.1);
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

export const IconBox = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, #22c55e, #4ade80);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 25px rgba(34, 197, 94, 0.3);
`;

export const HeaderText = styled.div``;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(to right, #22c55e, #a3e635);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const Subtitle = styled.p`
  font-size: 0.75rem;
  color: rgba(134, 239, 172, 0.6);
`;

export const CategoriesWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  height: fit-content;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(34, 197, 94, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(34, 197, 94, 0.5);
  }
`;

export const CategoryButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(34, 197, 94, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(6px);

  &:hover {
    border-color: rgba(34, 197, 94, 0.6);
    background: rgba(15, 23, 42, 0.55);
    box-shadow: 0 0 10px rgba(34, 197, 94, 0.15);
  }
`;

export const CategoryButtonLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const CategoryIcon = styled(Zap)`
  width: 1rem;
  height: 1rem;
  color: #22c55e;
  transition: color 0.3s;

  ${CategoryButton}:hover & {
    color: #4ade80;
  }
`;

export const CategoryName = styled.span`
  font-weight: 600;
  color: #86efac;
  transition: color 0.3s;

  ${CategoryButton}:hover & {
    color: #ecfeff;
  }
`;

export const CategoryBadge = styled.span`
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  background: rgba(34, 197, 94, 0.2);
  color: #bbf7d0;
  border: 1px solid rgba(22, 163, 74, 0.4);
  font-weight: 500;
`;

export const ChevronIcon = styled(ChevronRight)<{ $expanded: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  color: #22c55e;
  transition: transform 0.3s;
  transform: ${(props) => (props.$expanded ? "rotate(90deg)" : "rotate(0)")};
`;

export const PartsWrapper = styled.div`
  margin-top: 0.5rem;
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const PartItem = styled.div<{
  $isSelected: boolean;
  $delay: number;
  $isDisabled: boolean;
}>`
  cursor: pointer;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid;
  backdrop-filter: blur(6px);
  transition: all 0.3s ease;
  animation: ${slideIn} 0.3s ease-out forwards;
  animation-delay: ${(props) => props.$delay}s;

  ${(props) =>
    props.$isSelected
      ? css`
          background: linear-gradient(
            to right,
            rgba(34, 197, 94, 0.25),
            rgba(22, 163, 74, 0.2)
          );
          border-color: rgba(34, 197, 94, 0.6);
          box-shadow: 0 0 15px rgba(34, 197, 94, 0.15);
        `
      : css`
          background: rgba(30, 41, 59, 0.25);
          border-color: rgba(51, 65, 85, 0.3);

          &:hover {
            border-color: rgba(34, 197, 94, 0.4);
            background: rgba(30, 41, 59, 0.45);
          }
        `}
  ${(props) =>
    props.$isDisabled &&
    css`
      cursor: not-allowed;
      opacity: 0.5;
      filter: grayscale(0.5);
    `}
`;

export const PartItemContent = styled.div`
  display: flex;
  align-items: start;
  gap: 0.75rem;
`;

export const StatusDot = styled.div<{ $isSelected: boolean }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  margin-top: 0.375rem;
  transition: all 0.3s;
  background: ${(props) => (props.$isSelected ? "#22c55e" : "#475569")};

  ${(props) =>
    props.$isSelected &&
    css`
      animation: ${pulseGlow} 2s infinite;
    `}
`;

export const PartContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 0;
  gap: 0.5rem;
`;

export const PartNameContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  min-width: 0;
`;

export const PartName = styled.div<{ $isSelected: boolean }>`
  font-weight: 500;
  transition: color 0.3s;
  color: ${(props) => (props.$isSelected ? "#f0fdf4" : "#bbf7d0")};

  ${PartItem}:hover & {
    color: #dcfce7;
  }
`;

export const DamageLevel = styled.div`
  font-weight: 500;
  color: #86efac;
  opacity: 0.9;
`;
