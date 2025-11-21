import { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";
import ButtonAction from "../../../components/Button/ButtonAction";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
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
  setViewDetailModal: (v: boolean) => void;
  isAnyPartNotDone: boolean;
}

const ReviewButton: React.FC<ReviewButtonProps> = ({
  onChangeStatus,
  appointment,
  appointmentHasCondition,
  setIsOrder,
  setIsOpenAlert,
  isUpdating,
  setViewDetailModal,
  isAnyPartNotDone,
}) => {
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

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "5px" }}>
        {(appointment.status === TechnicianWorkingSessionEnum.CONFIRM ||
          appointment.status === TechnicianWorkingSessionEnum.INPROGRESS) && (
          <ButtonAction
            text="View Details"
            variant="outline"
            action={() => setViewDetailModal(true)}
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
                disabled={isAnyPartNotDone}
                tooltipTitle="You must complete all repairs before finishing the appointment"
              />
            </>
          ))}
      </div>
    </>
  );
};

export default ReviewButton;
