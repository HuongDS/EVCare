import { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";
import ViewDetailsModal from "./ViewDetailsModal";
import ButtonAction from "../../../components/Button/ButtonAction";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { useState } from "react";

interface ReviewButtonProps {
  onChangeStatus: (nextStatus: TechnicianWorkingSessionEnum) => void;
  appointment: TechnicianAppointmentsDto;
  setIsOrder: (v: boolean) => void;
}

const ReviewButton: React.FC<ReviewButtonProps> = ({ onChangeStatus, appointment, setIsOrder }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {appointment.status === TechnicianWorkingSessionEnum.ADDING_PART && (
        <div style={{ textAlign: "end" }}>
          <ButtonAction text={"Order"} color="#00AD4E" backgroundColor="#fff" action={() => setIsOrder(true)} />
          <div style={{ display: "inline-block", width: "10px", height: "10px" }} />
          <ButtonAction
            text="Continue"
            color="#fff"
            backgroundColor="#00AD4E"
            action={() => onChangeStatus(TechnicianWorkingSessionEnum.CONFIRM)}
          />
        </div>
      )}

      <div style={{ textAlign: "end" }}>
        {(appointment.status === TechnicianWorkingSessionEnum.CONFIRM ||
          appointment.status === TechnicianWorkingSessionEnum.INPROGRESS) && (
          <ButtonAction
            text="View Details"
            color="#00AD4E"
            backgroundColor="#ffffffff"
            borderColor="#00AD4E"
            backgroundColorHover="#ffffffff"
            action={() => setIsModalOpen(true)}
          />
        )}

        {appointment.status === TechnicianWorkingSessionEnum.INPROGRESS && (
          <>
            <div style={{ display: "inline-block", width: "10px", height: "10px" }} />
            <ButtonAction
              text="Done"
              color="#fff"
              backgroundColor="#00AD4E"
              action={() => onChangeStatus(TechnicianWorkingSessionEnum.COMPLETED)}
            />
          </>
        )}
      </div>

      <ViewDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} appointment={appointment ?? null} />
    </>
  );
};

export default ReviewButton;
