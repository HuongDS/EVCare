import { Modal } from "antd";
import styled from "styled-components";

export const ModalStyled = styled(Modal)`
  top: 5%;
  right: 15%;
  .ant-modal-content {
    width: 1000px !important;
    max-height: 90vh;
    overflow-y: hidden;
  }
`;
export const PageContainer = styled.div`
  max-height: 90vh;
  background: linear-gradient(
    135deg,
    rgba(0, 116, 56, 0.5) 0%,
    rgba(0, 176, 70, 0.5) 100%
  );
  padding: 24px;
  font-family: "Outfit", sans-serif;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1400px;
  max-height: 80vh;
  overflow-y: auto;
  margin: 0 auto;
  padding-right: 5px;
  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background: #e4f3eb;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #b1e6c9;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #00ad4e;
  }
`;

export const HeaderCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const AppointmentId = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #00ad4e;
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 20px;
  border: 2px solid;
`;

export const DateSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #666;
  font-weight: 600;

  svg {
    color: #00ad4e;
  }
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Card = styled.div`
  height: 300px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 2px solid #f0f0f0;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ad4e;
  }
`;

export const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #00ad4e;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e8f5e9;

  svg {
    color: #00ad4e;
  }
`;

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 12px;
`;

export const VehicleImage = styled.img`
  width: 150px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e8f5e9;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const IconLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;

  svg {
    color: #00ad4e;
  }
`;

export const InfoValue = styled.div`
  font-size: 14px;
  color: #333;
  font-weight: 600;
`;

export const ServicesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 5px;
  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background: #e4f3eb;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #b1e6c9;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #00ad4e;
  }
`;

export const ServiceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #f8fdf9;
  border-radius: 8px;
  border: 1px solid #e8f5e9;
`;

export const ServiceLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ServiceName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

export const NotesContent = styled.div`
  padding: 12px;
  background: #f8fdf9;
  border-radius: 8px;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  border: 1px solid #e8f5e9;
`;

export const ActionsCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 2px solid #f0f0f0;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const BackButton = styled.button`
  padding: 12px 32px;
  background: #e0e0e0;
  color: #666;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Outfit", sans-serif;

  &:hover {
    background: #d5d5d5;
    transform: translateY(-1px);
  }
`;

export const CancelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 32px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Outfit", sans-serif;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);

  &:hover {
    background: #d32f2f;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;
