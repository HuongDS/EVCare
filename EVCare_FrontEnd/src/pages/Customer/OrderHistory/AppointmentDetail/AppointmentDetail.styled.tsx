import styled from "styled-components";
import { AppointmentStatusEnum } from "../../../../models/enums";

export const DetailWrapper = styled.div`
  font-family: "Outfit", sans-serif;
  padding: 50px 0;
  display: flex;
  justify-content: center;
`;

export const Title = styled.h1`
  font-weight: 600;
  font-size: 30px;
  text-align: center;
  color: #00ad4e;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

export const TitleID = styled.h1`
  font-weight: 600;
  font-size: 1em;
  text-align: center;
  margin-bottom: 0;
`;

export const Button = styled.button`
  display: block;
  width: 300px;
  height: 50px;
  margin: 30px auto;
  font-family: "Outfit", sans-serif;
  font-size: 30px;
  font-weight: 600;
  color: white;
  border-radius: 20px;
  border: none;
  background-color: #00ad4e;
  cursor: pointer;

  &:hover {
    background-color: #0039a6;
  }

  @media (max-width: 480px) {
    width: 220px;
    height: 45px;
    font-size: 20px;
  }
`;

export const Backdrop = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
`;

export const Wrapper = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 1001;
`;

export const OrderModal = styled.div<{ $isOpen: boolean }>`
  background: #fff;
  padding: 20px 40px;
  padding-right: 0;
  border-radius: 12px;
  width: 600px;
  max-width: 95%;
  scrollbar-gutter: stable;

  display: flex;
  flex-direction: column;

  transform: ${({ $isOpen }) => ($isOpen ? "scale(1)" : "scale(0.8)")};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: all 0.3s ease;

  z-index: 1002;

  max-height: none;
  overflow-y: auto;

  position: relative;
  margin: auto;
`;

export const Legend = styled.p`
  font-size: 18px;
  font-weight: 600;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 20px;
  // margin-top: 10px;
  align-items: center;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const StaffRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 2%;
  align-items: center;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const InputBox = styled.input`
  background: #f2f4f3;
  border-radius: 8px;
  padding: 10px 14px;
  width: 100%;
  border: none;
  font-size: 14px;

  @media (max-width: 480px) {
    font-size: 13px;
    padding: 8px 12px;
  }
`;

export const NoteBox = styled.textarea`
  background: #f2f4f3;
  border-radius: 8px;
  padding: 10px 14px;
  width: 100%;
  border: none;
  font-size: 14px;
  min-height: 60px;
  resize: vertical;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  margin-top: 10px;

  @media (max-width: 480px) {
    font-size: 13px;
    padding: 8px 12px;
    min-height: 50px;
  }
`;

export const Icon = styled.i`
  padding-right: 5%;
`;

export const ServiceList = styled.div`
  max-height: 11vh;
  overflow-y: visible;
  margin-top: 8px;
  @media (max-width: 480px) {
    max-height: 120px;
  }
`;

export const ServiceItemBox = styled.div`
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
  font-family: "Outfit", sans-serif;
  display: flex;
  justify-content: space-between;

  @media (max-width: 480px) {
    font-size: 13px;
    padding: 6px 10px;
  }
`;

export const TotalRow = styled.div`
  text-align: right;
  font-weight: 700;
  font-size: 16px;
  margin-top: 10px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const Status = styled.div`
  font-size: 14px;
  font-weight: 500;
  position: absolute;
  top: 30px;
  right: 40px;
  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

interface StatusBadgeProps {
  status: AppointmentStatusEnum | string;
}

export const StatusBadge = styled.span<StatusBadgeProps>`
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 600;
  text-transform: capitalize;
  color: white;
  background: ${({ status }) => {
    switch (status) {
      case AppointmentStatusEnum.PENDING:
        return "#fbc02d";
      case AppointmentStatusEnum.CONFIRMED:
        return "#2196f3";
      case AppointmentStatusEnum.CHECKED_IN:
        return "#9c27b0";
      case AppointmentStatusEnum.IN_PROGRESS:
        return "#ff9800";
      case AppointmentStatusEnum.DONE:
        return "#4caf50";
      case AppointmentStatusEnum.CANCELED:
        return "#f44336";
      default:
        return "#9e9e9e";
    }
  }};

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 3px 8px;
  }
`;

export const ServiceItem = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  flex: 1;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const ServicePrice = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  min-width: 100px;
  text-align: right;
  display: inline-block;

  @media (max-width: 480px) {
    font-size: 13px;
    min-width: 80px;
  }
`;

export const Section = styled.div`
  margin-top: 20px;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 10px;
  background: #fafafa;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const ModalContent = styled.div`
  overflow-y: auto;
  max-height: 90vh;
  padding-right: 15px;
`;
