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

export const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f0f9f4 0%, #e6f7f0 100%);
`;

export const Header = styled.header`
  max-width: 900px;
  margin: 1.5rem auto;
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

export const ConfigWrapper = styled(motion.form)`
  max-width: 900px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
`;

export const ConfigGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem 2rem;
  padding: 2rem 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1.5rem;
  }
`;

export const FullWidthWrapper = styled.div`
  grid-column: 1 / -1;
`;

export const SectionTitle = styled.h2`
  grid-column: 1 / -1;
  font-size: 1.25rem;
  font-weight: 600;
  color: #065f46;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const InstructionText = styled.p`
  font-size: 0.85rem;
  font-style: italic;
  color: #6b7280;
  margin: -8px 0 0 0;
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1.5rem 2.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
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
