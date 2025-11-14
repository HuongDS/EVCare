import { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";
import ViewDetailsModal from "./ViewDetailsModal";
import ButtonAction from "../../../components/Button/ButtonAction";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { useState } from "react";
import type { PartDamageLevelDetail } from "../../../models/OrderPartModel/AppointmentPartCondition";
import {
  MSG_TITLE,
  SUCCESS_MESSAGE,
} from "../../../constants/messages/Message";

interface ReviewButtonProps {
  onChangeStatus: (
    status: TechnicianWorkingSessionEnum,
    message: string,
    description: string
  ) => void;
  appointment: TechnicianAppointmentsDto;
  appointmentHasCondition: PartDamageLevelDetail[];
  setIsOrder: (v: boolean) => void;
  setIsOpenAlert: (v: boolean) => void;
}

const ReviewButton: React.FC<ReviewButtonProps> = ({
  onChangeStatus,
  appointment,
  appointmentHasCondition,
  setIsOrder,
  setIsOpenAlert,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {appointment.status === TechnicianWorkingSessionEnum.ADDING_PART && (
        <div style={{ textAlign: "end" }}>
          {appointmentHasCondition.length > 0 ? (
            <ButtonAction
              text="Update"
              variant="outline"
              action={() => setIsOrder(true)}
            />
          ) : (
            <ButtonAction
              text={"Order"}
              variant="primary"
              action={() => setIsOrder(true)}
            />
          )}

          <div
            style={{ display: "inline-block", width: "10px", height: "10px" }}
          />

          <ButtonAction
            text="Continue"
            variant="secondary"
            action={() => setIsOpenAlert(true)}
          />
        </div>
      )}

      <div style={{ textAlign: "end" }}>
        {(appointment.status === TechnicianWorkingSessionEnum.CONFIRM ||
          appointment.status === TechnicianWorkingSessionEnum.INPROGRESS) && (
          <ButtonAction
            text="View Details"
            variant="outline"
            action={() => setIsModalOpen(true)}
          />
        )}

        {appointment.status === TechnicianWorkingSessionEnum.INPROGRESS && (
          <>
            <div
              style={{ display: "inline-block", width: "10px", height: "10px" }}
            />
            <ButtonAction
              text="Done"
              variant="primary"
              action={() =>
                onChangeStatus(
                  TechnicianWorkingSessionEnum.COMPLETED,
                  MSG_TITLE.TECH_COMPLETED,
                  SUCCESS_MESSAGE.TECHNICIAN_COMPLETED
                )
              }
            />
          </>
        )}
      </div>

      <ViewDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={appointment ?? null}
      />
    </>
  );
};

export default ReviewButton;
