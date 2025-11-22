import styled from "styled-components";
import { lighten } from "polished";

const EVCareGreen = "#00ad4e";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out forwards;
`;

export const ReviewFormContainer = styled.div`
  font-family: "Outfit", sans-serif;
  background: #ffffff;
  border-radius: 16px;
  padding: 2.5rem 3rem;
  max-width: 700px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  z-index: 1001;
  animation: slideUp 0.4s ease-out forwards;
  margin-top: 80px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #eef2f7;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid #e0e0e0;
`;

export const ModalTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #00c656 0%, ${EVCareGreen} 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2.2rem;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:hover {
    background: #f1f5f9;
    color: #334155;
    transform: scale(1.1);
  }
`;

export const InfoSection = styled.div`
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: #f8fcf9;
  border-radius: 12px;
  border: 1px solid #e6f7ee;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8fcf9;
  border-radius: 12px;
  border: 1px solid #e6f7ee;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InfoLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
`;

export const InfoValue = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #334155;
  line-height: 1.4;
`;

export const RatingSection = styled.div`
  margin-bottom: 2rem;
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #eef2f7;
  .stars {
    display: flex;
    gap: 8px;
  }

  .star {
    font-size: 32px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #e0e0e0;
  }

  .star:hover {
    color: #ffc107;
    transform: scale(1.1);
  }

  .star.active {
    color: #ffc107;
  }
`;

export const RatingLabel = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
`;

export const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  .rating-value {
    font-size: 1.2rem;
    font-weight: 700;
    color: ${EVCareGreen};
    min-width: 50px;
    padding-left: 1rem;
    border-left: 1px solid #e0e0e0;
  }
`;

export const RatingText = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
`;

export const FormSection = styled.div`
  margin-bottom: 2rem;
`;

export const FormLabel = styled.label`
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.8rem;
`;

export const TextareaContainer = styled.div`
  position: relative;
  .tox .tox-editor-container {
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    box-shadow: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:focus-within {
      border-color: ${EVCareGreen};
      box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.2);
    }
  }

  .tox .tox-toolbar-overlord {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  .tox .tox-statusbar {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    background-color: #f8fafc;
    border-top: 1px solid #e2e8f0;
  }
`;

export const CharCounter = styled.span`
  position: absolute;
  bottom: 12px;
  right: 12px;
  font-size: 0.8rem;
  color: #94a3b8;
  background: #f8fafc;
  padding: 4px 8px;
  border-radius: 4px;
  z-index: 1;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SubmitButton = styled.button`
  flex: 1;
  background: linear-gradient(135deg, #00c656 0%, ${EVCareGreen} 100%);
  color: #fff;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-family: "Outfit", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.25);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, ${lighten(0.05, EVCareGreen)} 0%, ${EVCareGreen} 100%);
    box-shadow: 0 6px 20px rgba(0, 173, 78, 0.4);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export const CancelButton = styled.button`
  flex: 1;
  background: #ffffff;
  color: #475569;
  border: 1px solid #cbd5e1;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-family: "Outfit", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  }
`;

const fadeIn = `
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = `
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const GlobalAnimations = styled.div`
  @keyframes fadeIn {
    ${fadeIn}
  }
  @keyframes slideUp {
    ${slideUp}
  }
`;

export const SuccessContainer = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 3rem 2rem;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease-out forwards;
`;

export const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  background: ${EVCareGreen};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 173, 78, 0.4);
`;

export const SuccessTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.8rem;
`;

export const SuccessText = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
`;

export const ReviewWrapper = styled.div`
  position: relative;
  z-index: 999;
`;

export const StarWrapper = styled.div`
  position: relative;
  z-index: 999;
  .stars {
    display: flex;
    gap: 4px;
  }

  .star {
    font-size: 22px;
    color: #d1d5db;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .star.active {
    color: #facc15;
  }
`;
