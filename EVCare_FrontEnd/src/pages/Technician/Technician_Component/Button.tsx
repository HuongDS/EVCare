import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import ViewDetailsModal from "./ViewDetailsModal";
import ButtonAction from "../../../components/Button/ReviewButton";
import AlertModal from "./AlertModal";
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
  const [showAlert, setShowAlert] = useState(false);
  return (
    <>
      {status === TechnicianWorkingSessionEnum.PENDING && (
        <ButtonAction
          text="Confirm"
          color="#fff"
          backgroundColor="#00AD4E"
          action={() => onAction(TechnicianWorkingSessionEnum.INPROGRESS)}
        />
      )}

      {status === TechnicianWorkingSessionEnum.INPROGRESS && (
        <>
          <ButtonAction
            text="Done"
            color="#fff"
            backgroundColor="#00AD4E"
            action={() => onAction(TechnicianWorkingSessionEnum.CONFIRM)}
          />
        </>
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

      {status === TechnicianWorkingSessionEnum.CONFIRM && (
        <>
          <ButtonAction
            text="Back"
            color="#fff"
            backgroundColor="#0073AD"
            action={() => onAction(TechnicianWorkingSessionEnum.INPROGRESS)}
          />
          <ButtonAction
            text="View Details"
            color="#fff"
            backgroundColor="#FFA500"
            action={() => setIsModalOpen(true)}
          />
          <ButtonAction
            text="Confirm"
            color="#fff"
            backgroundColor="#00AD4E"
            action={() => setShowAlert(true)} // bật alert modal
          />
        </>
      )}

      {(status === TechnicianWorkingSessionEnum.COMPLETED ||
        status === TechnicianWorkingSessionEnum.CANCELLED) && (
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
        message={
          status === TechnicianWorkingSessionEnum.ADDING_PART
            ? "You will not be able to add parts after confirming. Are you sure you want to continue?"
            : "Are you sure you have finished and want to confirm?"
        }
        onConfirm={() => {
          if (status === TechnicianWorkingSessionEnum.ADDING_PART) {
            onAction(TechnicianWorkingSessionEnum.INPROGRESS);
          } else if (status === TechnicianWorkingSessionEnum.CONFIRM) {
            onAction(TechnicianWorkingSessionEnum.COMPLETED);
          }
          setShowAlert(false);
        }}
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
