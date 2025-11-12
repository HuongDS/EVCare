import styled from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  padding: 20px 20px;
  font-family: "Outfit", sans-serif;
`;

export const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  background: white;
  padding: 24px 32px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const HeaderIcon = styled.div`
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #00ad4e 0%, #00c853 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.3);
`;

export const HeaderText = styled.div`
  flex: 1;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #00ad4e;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 15px;
    color: #666;
    margin: 0;
  }
`;

export const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailsSection = styled.div``;

export const FormSection = styled.form``;

export const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0 0 16px 0;
`;

export const AppointmentCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

export const AppointmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
`;

export const AppointmentId = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #00ad4e;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  background: ${(props) => {
    switch (props.$status.toLowerCase()) {
      case "completed":
        return "#e8f5e9";
      case "in progress":
        return "#fff3e0";
      case "pending":
        return "#e3f2fd";
      default:
        return "#f5f5f5";
    }
  }};
  color: ${(props) => {
    switch (props.$status.toLowerCase()) {
      case "completed":
        return "#2e7d32";
      case "in progress":
        return "#e65100";
      case "pending":
        return "#1565c0";
      default:
        return "#616161";
    }
  }};
`;

export const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InfoRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  background: #f1f8f4;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00ad4e;
  flex-shrink: 0;
`;

export const InfoContent = styled.div`
  flex: 1;
`;

export const InfoLabel = styled.div`
  font-size: 12px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 2px;
`;

export const InfoValue = styled.div`
  font-size: 15px;
  color: #333;
  font-weight: 600;
`;

export const ServicesSection = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid #f0f0f0;
  overflow-y: auto;
  height: 150px;
`;

export const ServicesLabel = styled.div`
  font-size: 13px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 12px;
`;

export const ServicesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ServiceTag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #e8f5e9;
  color: #00ad4e;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;

  svg {
    flex-shrink: 0;
  }
`;

export const ReminderCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

export const ReminderTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
`;

export const QuickSelect = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
`;

export const QuickButton = styled.button<{ $selected: boolean }>`
  padding: 16px;
  border: 2px solid ${(props) => (props.$selected ? "#00ad4e" : "#e0e0e0")};
  background: ${(props) => (props.$selected ? "#e8f5e9" : "white")};
  color: ${(props) => (props.$selected ? "#00ad4e" : "#666")};
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ad4e;
    background: #f1f8f4;
    transform: translateY(-2px);
  }
`;

export const Divider = styled.div`
  text-align: center;
  color: #999;
  font-size: 13px;
  margin: 20px 0;
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background: #e0e0e0;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
`;

export const CustomInput = styled.div`
  margin-bottom: 24px;
`;

export const InputLabel = styled.div`
  font-size: 13px;
  color: #666;
  font-weight: 600;
  margin-bottom: 8px;
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 14px 80px 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  color: #333;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ad4e;
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.1);
  }
`;

export const InputSuffix = styled.div`
  position: absolute;
  right: 16px;
  font-size: 14px;
  color: #999;
  font-weight: 600;
  pointer-events: none;
`;

export const PreviewBox = styled.div`
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%);
  border: 2px solid #c8e6c9;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
`;

export const PreviewLabel = styled.div`
  font-size: 12px;
  color: #00ad4e;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

export const PreviewDate = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #00ad4e;
`;

export const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 24px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const SkipButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  border: 2px solid #e0e0e0;
  background: white;
  color: #666;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ad4e;
    color: #00ad4e;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const ConfirmButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  border: none;
  background: linear-gradient(135deg, #00ad4e 0%, #00c853 100%);
  color: white;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 173, 78, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;
