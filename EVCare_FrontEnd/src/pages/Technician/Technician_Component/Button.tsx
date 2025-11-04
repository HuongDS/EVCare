import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import ViewDetailsModal from "./ViewDetailsModal";
import ButtonAction from "../../../components/Button/ButtonAction";
import AlertModal from "./AlertModal";

interface ReviewButtonProps {
  status: TechnicianWorkingSessionEnum;
  orderId?: number;
  appointment: TechnicianAppointmentsDto;
  onAction: (nextStatus: TechnicianWorkingSessionEnum) => void;
  onAfterAction?: () => void;
}

const ReviewButton: React.FC<ReviewButtonProps> = ({
  status,
  orderId,
  appointment,
  onAction,
  onAfterAction,
}) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleNavigate = () => {
    if (!orderId) {
      console.error("OrderId is missing! Cannot navigate to order page.");
      return;
    }

    navigate("/technician/order", {
      state: {
        orderId,
        existingParts: appointment.parts || [],
      },
    });
  };

  const getAlertMessage = () => {
    switch (status) {
      case TechnicianWorkingSessionEnum.ADDING_PART:
        return "You will not be able to add parts after confirming. Continue?";
      case TechnicianWorkingSessionEnum.INPROGRESS:
        return "Are you sure you have finished this task?";
      default:
        return "";
    }
  };

  const handleConfirmAction = () => {
    if (status === TechnicianWorkingSessionEnum.ADDING_PART) {
      onAction(TechnicianWorkingSessionEnum.CONFIRM);
    } else if (status === TechnicianWorkingSessionEnum.INPROGRESS) {
      onAction(TechnicianWorkingSessionEnum.COMPLETED);
    }

    setShowAlert(false);
    onAfterAction?.();
  };

  return (
    <>
      {status === TechnicianWorkingSessionEnum.PENDING && (
        <ButtonAction
          text="Confirm"
          color="#fff"
          backgroundColor="#00AD4E"
          action={() => onAction(TechnicianWorkingSessionEnum.ADDING_PART)}
        />
      )}

      {status === TechnicianWorkingSessionEnum.ADDING_PART && (
        <>
          <ButtonAction
            text={
              appointment.parts && appointment.parts.length > 0
                ? "Update Order"
                : "Order"
            }
            color="#fff"
            backgroundColor="#0073AD"
            action={handleNavigate}
          />
          <ButtonAction
            text="Continue"
            color="#fff"
            backgroundColor="#00AD4E"
            action={() => setShowAlert(true)}
          />
        </>
      )}

      {status === TechnicianWorkingSessionEnum.INPROGRESS && (
        <ButtonAction
          text="Done"
          color="#fff"
          backgroundColor="#00AD4E"
          action={() => setShowAlert(true)}
        />
      )}

      {(status === TechnicianWorkingSessionEnum.CONFIRM ||
        status === TechnicianWorkingSessionEnum.COMPLETED ||
        status === TechnicianWorkingSessionEnum.CANCELED ||
        status === TechnicianWorkingSessionEnum.INPROGRESS) && (
        <ButtonAction
          text="View Details"
          color="#fff"
          backgroundColor="#FFA500"
          action={() => setIsModalOpen(true)}
        />
      )}

      <AlertModal
        open={showAlert}
        onClose={() => setShowAlert(false)}
        message={getAlertMessage()}
        onConfirm={handleConfirmAction}
      />

      <ViewDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={appointment}
      />
    </>
  );
};

export default ReviewButton;
