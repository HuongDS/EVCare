import styled from "styled-components";
import { TechnicianWorkingSessionEnum } from "../../../../models/enums/TechnicianWorkingSessionEnum";

const statusColors: Record<TechnicianWorkingSessionEnum, string> = {
  [TechnicianWorkingSessionEnum.PENDING]: "#ff9800",
  [TechnicianWorkingSessionEnum.ADDING_PART]: "#3f51b5",
  [TechnicianWorkingSessionEnum.CONFIRM]: "#2196f3",
  [TechnicianWorkingSessionEnum.INPROGRESS]: "#9c27b0",
  [TechnicianWorkingSessionEnum.COMPLETED]: "#4caf50",
  [TechnicianWorkingSessionEnum.CANCELED]: "#f44336",
};

/* 🟢 Dùng transient prop: $status */
export const AppointmentStatus = styled.div<{
  $status: TechnicianWorkingSessionEnum;
}>`
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95em;
  text-transform: capitalize;
  background-color: ${({ $status }) => statusColors[$status]}20;
  color: ${({ $status }) => statusColors[$status]};
  border: 1px solid ${({ $status }) => statusColors[$status]};
  display: inline-flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 480px) {
    font-size: 0.85em;
    padding: 4px 10px;
  }
`;

export const Card = styled.div`
  font-family: "Outfit", sans-serif;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  margin: 12px;
  padding: 16px 22px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    padding: 14px 18px;
  }

  @media (max-width: 480px) {
    margin: 10px 0;
    padding: 12px 14px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  row-gap: 0.5rem;
`;

export const AppointmentID = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  color: #333;

  span {
    color: #555;
  }

  @media (max-width: 480px) {
    font-size: 1em;
  }
`;

export const AppointmentDate = styled.div`
  display: flex;
  column-gap: 0.5rem;
  align-items: center;
  font-size: 1rem;
  color: #555;

  i {
    font-size: 1.2em;
    color: #777;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export const CardBody = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5em;
  margin-top: 15px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1em;
  }
`;

export const Title = styled.div`
  font-size: 1.4em;
  font-weight: bold;
  padding-bottom: 5px;
  color: #333;

  @media (max-width: 480px) {
    font-size: 1.2em;
  }
`;

export const Info = styled.div`
  font-size: 1em;
  color: #555;
  word-break: break-word;

  @media (max-width: 480px) {
    font-size: 0.9em;
  }
`;

export const InformationStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8em;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ListService = styled.div`
  max-height: 6em;
  overflow-y: auto;
  margin-top: 8px;
`;

export const ListPart = styled.div`
  max-height: 6em;
  overflow-y: auto;
  margin-top: 8px;
`;

export const ButtonStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 12px;

  @media (max-width: 480px) {
    justify-content: center;
  }
`;

export const AppointmentImagesWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-top: 10px;
  border-radius: 12px;
`;

export const AppointmentImages = styled.div<{ $currentIndex: number }>`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: translateX(${({ $currentIndex }) => `-${$currentIndex * 100}%`});
`;

export const ImageItem = styled.div`
  min-width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 50%;
    max-height: 160px;
    object-fit: contain;
    border-radius: 12px;
  }

  @media (max-width: 1024px) {
    height: 220px;
  }

  @media (max-width: 768px) {
    height: 180px;
  }

  @media (max-width: 480px) {
    height: 150px;
  }
`;

export const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 8px;
  gap: 6px;
`;

export const Dot = styled.div<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "#4caf50" : "#ccc")};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: #4caf50;
  }

  @media (max-width: 480px) {
    width: 8px;
    height: 8px;
  }
`;
