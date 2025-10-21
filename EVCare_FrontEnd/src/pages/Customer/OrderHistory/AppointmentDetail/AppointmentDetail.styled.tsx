import styled, { keyframes } from "styled-components";
import { AppointmentStatusEnum } from "../../../../models/enums";

const modalFadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const DetailWrapper = styled.div`
  font-family: "Outfit", sans-serif;
  padding: 50px 0;
  display: flex;
  justify-content: center;
`;

export const Title = styled.h1`
  font-weight: 700;
  font-size: 28px;
  text-align: center;

  background: linear-gradient(90deg, #00c656 0%, #00ad4e 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  margin-bottom: 16px;
  margin-top: 0;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

export const TitleID = styled.h1`
  font-weight: 600;
  font-size: 1.1em;
  text-align: center;
  margin-bottom: 0;
  color: #374151;
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
  /* Giảm độ tối, thêm hiệu ứng blur */
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Hỗ trợ Safari */
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
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);

  border-radius: 16px;
  width: 850px;
  max-width: 95%;

  padding: 24px;
  color: #1a202c;

  display: flex;
  flex-direction: column;

  animation: ${modalFadeIn} 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  transform: scale(${({ $isOpen }) => ($isOpen ? "1" : "0.9")});
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};

  z-index: 1002;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  margin: auto;

  & > .btn-close {
    transition: transform 0.2s ease;
    opacity: 0.6;
    &:hover {
      opacity: 1;
      transform: scale(1.1);
    }
  }
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
  color: #333;
  border: 1px solid #dde1df;
  border-radius: 8px;
  padding: 10px 14px;
  width: 100%;
  font-size: 14px;
  min-height: 60px;
  resize: vertical;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  margin-top: 10px;

  &::placeholder {
    color: #8a94a1;
  }

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
  max-height: 20vh;
  overflow-y: auto;
  margin-top: 8px;
  padding-right: 5px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }

  & > ${Row} {
    margin-top: 8px;
  }

  @media (max-width: 480px) {
    max-height: 150px;
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
  color: #374151; /* Màu tối */

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
      case AppointmentStatusEnum.READY_FOR_PICKUP:
        return "#14b8a6";
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
  font-size: 15px;
  font-weight: 500;
  color: #333;
  flex: 1;

  &::before {
    content: "•";
    color: #00ad4e;
    font-size: 1.2em;
    font-weight: 700;
    margin-right: 10px;
    line-height: 1;
  }

  @media (max-width: 480px) {
    font-size: 14px;
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
  margin-top: 16px;
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;

  background: #f9fafb;
  border: 1px solid #e5e7eb;

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

export const ModalContent = styled.div`
  overflow-y: auto;
  max-height: calc(90vh - 150px);
  padding-right: 15px;
  scrollbar-gutter: stable;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05); /* Nền track sáng */
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3); /* Thumb tối */
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.5);
  }
`;
