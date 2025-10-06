import { useNavigate } from "react-router-dom";
import { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";
import styled from "styled-components";

interface ButtonProps {
  variant?: "primary" | "secondary";
}

const ButtonStyled = styled.button<ButtonProps>`
  background-color: ${({ variant }) =>
    variant === "secondary" ? "#0073AD" : "#00AD4E"};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  margin-right: 8px;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }
`;

interface ReviewButtonProps {
  status: TechnicianWorkingSessionEnum;
  onAction: (nextStatus: TechnicianWorkingSessionEnum) => void;
  orderId?: number;
}

const ReviewButton: React.FC<ReviewButtonProps> = ({
  status,
  onAction,
  orderId,
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (!orderId) {
      console.error("OrderId is missing! Cannot navigate to order page.");
      return;
    }
    navigate("/technician/order", { state: { orderId } });
  };

  switch (status) {
    case TechnicianWorkingSessionEnum.PENDING:
      return (
        <ButtonStyled
          onClick={() => onAction(TechnicianWorkingSessionEnum.INPROGRESS)}
        >
          Confirm
        </ButtonStyled>
      );

    case TechnicianWorkingSessionEnum.INPROGRESS:
      return (
        <>
          <ButtonStyled
            onClick={() => onAction(TechnicianWorkingSessionEnum.COMPLETED)}
          >
            Done
          </ButtonStyled>

          <ButtonStyled
            variant="secondary"
            onClick={() => {
              onAction(TechnicianWorkingSessionEnum.ADDING_PART);
              handleNavigate();
            }}
          >
            Order
          </ButtonStyled>
        </>
      );

    case TechnicianWorkingSessionEnum.ADDING_PART:
      return (
        <>
          <ButtonStyled variant="secondary" onClick={handleNavigate}>
            Order
          </ButtonStyled>

          <ButtonStyled
            onClick={() => onAction(TechnicianWorkingSessionEnum.INPROGRESS)}
          >
            Continue
          </ButtonStyled>
        </>
      );

    case TechnicianWorkingSessionEnum.COMPLETED:
    case TechnicianWorkingSessionEnum.CANCELLED:
      return (
        <ButtonStyled
          variant="secondary"
          onClick={() => onAction(TechnicianWorkingSessionEnum.CANCELLED)}
        >
          View Details
        </ButtonStyled>
      );

    default:
      return null;
  }
};

export default ReviewButton;
