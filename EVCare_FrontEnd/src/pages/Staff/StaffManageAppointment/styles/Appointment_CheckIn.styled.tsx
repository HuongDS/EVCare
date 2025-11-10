import styled from "styled-components";

export const PageContainer = styled.div`
  max-height: 100vh;
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  padding: 32px 20px;
  font-family: "Outfit", sans-serif;
`;

export const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
  background: white;
  padding: 24px 28px;
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
    margin: 0 0 6px 0;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 24px;
    }
  }
`;

export const AppointmentId = styled.div`
  font-size: 16px;
  color: #666;
  font-weight: 600;
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
`;

export const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
`;

export const CardTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #00ad4e;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;

  svg {
    color: #00ad4e;
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const InfoLabel = styled.div`
  font-size: 12px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    color: #00ad4e;
  }
`;

export const InfoValue = styled.div`
  font-size: 16px;
  color: #333;
  font-weight: 600;
`;

export const ServicesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #00ad4e;
    border-radius: 10px;
  }
`;

export const ServiceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fdf9;
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: #e8f5e9;
    transform: translateX(4px);
  }
`;

export const ServiceNumber = styled.div`
  width: 28px;
  height: 28px;
  background: #00ad4e;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const ServiceName = styled.div`
  font-size: 15px;
  color: #333;
  font-weight: 600;
`;

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const VehicleImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #e8f5e9;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ad4e;
    transform: scale(1.05);
  }
`;

export const NotesBox = styled.div`
  padding: 16px;
  background: #f8fdf9;
  border: 2px solid #e8f5e9;
  border-radius: 12px;
  font-size: 15px;
  color: #333;
  line-height: 1.6;
  min-height: 80px;
  white-space: pre-wrap;
`;

export const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 16px;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const SpinnerWrapper = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  padding: 20px;
`;

export const CancelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  border: 2px solid #f44336;
  background: white;
  color: #f44336;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ffebee;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const CheckInButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  border: none;
  background: linear-gradient(135deg, #00ad4e 0%, #00c853 100%);
  color: white;
  border-radius: 12px;
  font-size: 16px;
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
