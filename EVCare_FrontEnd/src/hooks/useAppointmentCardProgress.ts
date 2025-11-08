import { useState, useEffect } from "react";
import { useNotification } from "../context/useNotification";
import type { TechnicianAppointmentsDto } from "../models/AppointmentsModel/Technician_Appointments_Model";
import type { TechnicianWorkingSessionEnum } from "../models/enums";
import { DamageLevelEnum } from "../models/enums/DamageLevelEnum";
import { getTechnicianAddedParts } from "../services/getTechnicianOrder";
import { getAppointmentPartCondition } from "../services/appointmentPartCondition";
import { updateTechnicianWorkingSession } from "../services/TechnicianWorkingSessionApi";
import { ERROR_MESSAGE } from "../constants/messages/Message";

type UseAppointmentCardProgressProps = {
  data: TechnicianAppointmentsDto;
  onStatusChange?: (
    orderId: number,
    newStatus: TechnicianWorkingSessionEnum
  ) => void;
  onPartsUpdated?: (orderId: number) => void;
};

export const useAppointmentCardProgress = ({
  data,
  onStatusChange,
  onPartsUpdated,
}: UseAppointmentCardProgressProps) => {
  const notification = useNotification();

  const [currentStatus, setCurrentStatus] =
    useState<TechnicianWorkingSessionEnum>(
      data.status as TechnicianWorkingSessionEnum
    );
  const [damageLevels, setDamageLevels] = useState<
    Record<number, DamageLevelEnum>
  >({});

  const { data: addedPartsResponse, isLoading: isLoadingParts } =
    getTechnicianAddedParts(data.orderId);

  const parts: any[] = addedPartsResponse?.data ?? [];

  useEffect(() => {
    const fetchDamageLevels = async () => {
      try {
        const response = await getAppointmentPartCondition(data.id);
        const map: Record<number, DamageLevelEnum> = {};
        response.data?.partDamageLevels?.forEach((d) => {
          switch (d.damageLevel) {
            case "Minor":
              map[d.partId] = DamageLevelEnum.Minor;
              break;
            case "Moderate":
              map[d.partId] = DamageLevelEnum.Moderate;
              break;
            case "Severe":
              map[d.partId] = DamageLevelEnum.Severe;
              break;
            case "Critical":
              map[d.partId] = DamageLevelEnum.Critical;
              break;
            default:
              map[d.partId] = DamageLevelEnum.NotAssessed;
          }
        });
        setDamageLevels(map);
      } catch (err) {
        console.error("Failed to load part condition:", err);
      }
    };

    if (data.id) fetchDamageLevels();
  }, [data.id]);

  const handleAction = async (nextStatus: TechnicianWorkingSessionEnum) => {
    const prevStatus = currentStatus;
    setCurrentStatus(nextStatus);
    onStatusChange?.(data.orderId, nextStatus);

    try {
      await updateTechnicianWorkingSession({
        orderId: data.orderId,
        status: nextStatus,
      });
      onPartsUpdated?.(data.orderId);
    } catch (err) {
      console.error(err);
      setCurrentStatus(prevStatus);
      onStatusChange?.(data.orderId, prevStatus);
      notification.error({
        message: ERROR_MESSAGE.CAN_NOT_UPDATE_STATUS,
        showProgress: true,
      });
    }
  };

  return {
    currentStatus,
    damageLevels,
    parts,
    isLoadingParts,

    handleAction,
  };
};
