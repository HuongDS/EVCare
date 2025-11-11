import { Modal } from "antd";
import styled from "styled-components";

export const ModalStyled = styled(Modal)`
  display: flex;
  justify-content: center;
  top: 2%;
  .ant-modal-content {
    width: 1000px !important;
    height: 94vh !important;
    overflow: hidden;
  }
`;

export const PageContainer = styled.div`
  margin-top: 3%;
  height: 100%;
  max-height: 85vh;
  background: linear-gradient(135deg, #93c6a2 0%, #e8eaf6 100%);
  border-radius: 20px;
  padding: 24px;
  overflow-y: auto;
  font-family: "Outfit", sans-serif;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 20px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 10px;
  }
`;

export const Header = styled.div`
  h1 {
    font-size: 24px;
    font-weight: 700;
    color: #00ad4e;
    margin: 0 0 4px 0;

    @media (max-width: 768px) {
      font-size: 20px;
    }
  }

  p {
    color: #666;
    margin: 0;
    font-size: 14px;

    @media (max-width: 768px) {
      font-size: 13px;
    }
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;

  h2 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 16px;
    }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 32px 20px;
  color: #999;

  svg {
    margin: 0 auto 12px;
    opacity: 0.5;
  }

  p:first-of-type {
    font-size: 16px;
    margin-bottom: 4px;
  }

  p:last-of-type {
    font-size: 13px;
  }
`;

export const TechnicianGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const SearchWrapper = styled.div`
  margin-bottom: 16px;
`;

export const SearchInput = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }

  input {
    width: 100%;
    padding: 12px 12px 12px 40px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 14px;
    font-family: "Outfit", sans-serif;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #2196f3;
      box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
    }

    @media (max-width: 768px) {
      padding: 10px 10px 10px 36px;
      font-size: 13px;
    }
  }
`;

export const SearchResultsContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #2196f3;
    border-radius: 10px;
  }
`;

export const TechnicianCardWrapper = styled.div<{
  $isSelected?: boolean;
  $isPrevious?: boolean;
}>`
  position: relative;
  border: 2px solid
    ${(props) =>
      props.$isPrevious
        ? "#00ad4e"
        : props.$isSelected
        ? "#2196f3"
        : "#e0e0e0"};
  background: ${(props) =>
    props.$isPrevious ? "#e8f5e9" : props.$isSelected ? "#e3f2fd" : "white"};
  border-radius: 10px;
  padding: 16px;
  transition: all 0.3s ease;

  ${(props) =>
    !props.$isSelected &&
    !props.$isPrevious &&
    `
    &:hover {
      border-color: #2196f3;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
    }
  `}

  @media (max-width: 768px) {
    padding: 14px;
  }
`;

export const PreviousBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  background: #00ad4e;
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 173, 78, 0.3);
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f44336;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(244, 67, 54, 0.3);

  &:hover {
    background: #d32f2f;
    transform: scale(1.1);
  }
`;

export const TechnicianHeader = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`;

export const Avatar = styled.img`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0e0e0;

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }
`;

export const TechnicianInfo = styled.div`
  flex: 1;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 4px 0;

    @media (max-width: 768px) {
      font-size: 15px;
    }
  }
`;

export const TechnicianId = styled.div`
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
  font-weight: 500;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  border: 1px solid;

  ${(props) => {
    switch (props.$status) {
      case "Available":
        return `
          background: #e8f5e9;
          color: #2e7d32;
          border-color: #a5d6a7;
        `;
      case "Busy":
        return `
          background: #fff3e0;
          color: #e65100;
          border-color: #ffcc80;
        `;
      case "OnLeave":
        return `
          background: #f5f5f5;
          color: #616161;
          border-color: #e0e0e0;
        `;
      default:
        return `
          background: #f5f5f5;
          color: #616161;
          border-color: #e0e0e0;
        `;
    }
  }}
`;

export const InfoSection = styled.div`
  margin-bottom: 12px;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 13px;
  margin-bottom: 6px;

  svg {
    color: #999;
    flex-shrink: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SkillsSection = styled.div`
  margin-bottom: 12px;

  p {
    font-size: 10px;
    font-weight: 700;
    color: #999;
    margin: 0 0 6px 0;
    letter-spacing: 0.5px;
  }
`;

export const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const SkillTag = styled.span<{ $isMore?: boolean }>`
  padding: 4px 10px;
  background: ${(props) => (props.$isMore ? "#f5f5f5" : "#e8eaf6")};
  color: ${(props) => (props.$isMore ? "#666" : "#3f51b5")};
  font-size: 11px;
  font-weight: 500;
  border-radius: 12px;
`;

export const ActionButton = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  padding: 10px;
  margin-top: auto;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  font-family: "Outfit", sans-serif;

  ${(props) =>
    props.$disabled
      ? `
    background: #e0e0e0;
    color: #9e9e9e;
  `
      : `
    background: #00ad4e;
    color: white;
    box-shadow: 0 2px 6px rgba(33, 150, 243, 0.3);

    &:hover {
      background: #2ede12;
      box-shadow: 0 3px 8px rgba(33, 150, 243, 0.4);
    }
  `}
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ClearButton = styled.button`
  padding: 12px 24px;
  background: #e0e0e0;
  color: #666;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Outfit", sans-serif;

  &:hover {
    background: #d5d5d5;
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 13px;
  }
`;

export const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  font-family: "Outfit", sans-serif;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 13px;
  }
`;
