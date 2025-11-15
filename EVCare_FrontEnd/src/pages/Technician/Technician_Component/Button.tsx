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
import ColorSpinner from "../../Staff/StaffComponents/ColorSpinner";

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
  isUpdating: boolean;
}

const ReviewButton: React.FC<ReviewButtonProps> = ({
  onChangeStatus,
  appointment,
  appointmentHasCondition,
  setIsOrder,
  setIsOpenAlert,
  isUpdating,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {appointment.status === TechnicianWorkingSessionEnum.ADDING_PART && (
        <div style={{ textAlign: "end", display: "flex", gap: "5px" }}>
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

          {isUpdating ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <ColorSpinner width="2em" height="2em" />
            </div>
          ) : (
            <>
              <ButtonAction
                text="Continue"
                variant="secondary"
                action={() => setIsOpenAlert(true)}
              />
            </>
          )}
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

        {appointment.status === TechnicianWorkingSessionEnum.INPROGRESS &&
          (isUpdating ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <ColorSpinner width="2em" height="2em" />
            </div>
          ) : (
            <>
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
          ))}
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
