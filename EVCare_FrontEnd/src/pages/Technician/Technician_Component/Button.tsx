// ReviewButton.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import ViewDetailsModal from "./ViewDetailsModal";

interface ButtonProps {
  $variant?: "primary" | "secondary";
}

const ButtonStyled = styled.button<ButtonProps>`
  background-color: ${({ $variant }) =>
    $variant === "secondary" ? "#0073AD" : "#00AD4E"};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  margin-right: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease-in-out;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

interface ReviewButtonProps {
  status: TechnicianWorkingSessionEnum;
  orderId?: number;
  appointment: TechnicianAppointmentsDto;
  onAction: (nextStatus: TechnicianWorkingSessionEnum) => void;
}

const ReviewButton: React.FC<ReviewButtonProps> = ({
  status,
  orderId,
  appointment,
  onAction,
}) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Chuyển sang trang order và truyền kèm danh sách part đã có
   */
  const handleNavigate = () => {
    if (!orderId) {
      console.error("OrderId is missing! Cannot navigate to order page.");
      return;
    }

    // truyền cả existingParts để trang Order nhận và load vào cart
    navigate("/technician/order", {
      state: {
        orderId,
        existingParts: appointment.parts || [],
      },
    });
  };

  return (
    <>
      {status === TechnicianWorkingSessionEnum.PENDING && (
        <ButtonStyled
          onClick={() => onAction(TechnicianWorkingSessionEnum.INPROGRESS)}
        >
          Confirm
        </ButtonStyled>
      )}

      {status === TechnicianWorkingSessionEnum.INPROGRESS && (
        <>
          <ButtonStyled
            onClick={() => onAction(TechnicianWorkingSessionEnum.CONFIRM)}
          >
            Done
          </ButtonStyled>
          <ButtonStyled
            $variant="secondary"
            onClick={() => onAction(TechnicianWorkingSessionEnum.ADDING_PART)}
          >
            Add Part
          </ButtonStyled>
        </>
      )}

      {status === TechnicianWorkingSessionEnum.ADDING_PART && (
        <>
          <ButtonStyled $variant="secondary" onClick={handleNavigate}>
            {appointment.parts && appointment.parts.length > 0
              ? "Update Order"
              : "Order"}
          </ButtonStyled>

          <ButtonStyled
            onClick={() => onAction(TechnicianWorkingSessionEnum.INPROGRESS)}
          >
            Continue
          </ButtonStyled>
        </>
      )}

      {status === TechnicianWorkingSessionEnum.CONFIRM && (
        <>
          <ButtonStyled
            $variant="secondary"
            onClick={() => onAction(TechnicianWorkingSessionEnum.INPROGRESS)}
          >
            Back
          </ButtonStyled>
          <ButtonStyled onClick={() => setIsModalOpen(true)}>
            View Details
          </ButtonStyled>
          <ButtonStyled>Confirm</ButtonStyled>
        </>
      )}

      {(status === TechnicianWorkingSessionEnum.COMPLETED ||
        status === TechnicianWorkingSessionEnum.CANCELLED) && (
        <ButtonStyled $variant="secondary" onClick={() => setIsModalOpen(true)}>
          View Details
        </ButtonStyled>
      )}

      <ViewDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={appointment}
      />
    </>
  );
};

export default ReviewButton;
