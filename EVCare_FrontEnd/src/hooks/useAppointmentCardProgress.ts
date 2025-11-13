// src/hooks/useAppointmentCardProgress.ts
import { useNotification } from "../context/useNotification";
import type { TechnicianAppointmentsDto } from "../models/AppointmentsModel/Technician_Appointments_Model";
import type { TechnicianWorkingSessionEnum } from "../models/enums";
import { DamageLevelEnum } from "../models/enums/DamageLevelEnum";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTechnicianAddedParts } from "../services/getTechnicianOrder";
import { getAppointmentPartCondition } from "../services/appointmentPartCondition";
import { useUpdateTechnicianWorkingSession } from "../services/TechnicianWorkingSessionApi";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import { useState, useMemo } from "react";

type UseAppointmentCardProgressProps = {
  data: TechnicianAppointmentsDto;
  onStatusChange?: (orderId: number, newStatus: TechnicianWorkingSessionEnum) => void;
  onPartsUpdated?: (orderId: number) => void;
};

export const useAppointmentCardProgress = ({
  data,
  onStatusChange,
  onPartsUpdated,
}: UseAppointmentCardProgressProps) => {
  const notification = useNotification();
  const queryClient = useQueryClient();
  const { mutateAsync: updateWorkingSession } = useUpdateTechnicianWorkingSession();

  const [currentStatus, setCurrentStatus] = useState<TechnicianWorkingSessionEnum>(
    data.status as TechnicianWorkingSessionEnum
  );

  // --- Fetch added parts ---
  const {
    data: parts = [],
    isLoading: isLoadingParts,
    refetch: refetchParts,
  } = useQuery({
    queryKey: ["TechnicianAddedParts", data.orderId],
    queryFn: () => fetchTechnicianAddedParts(data.orderId),
    enabled: !!data.orderId,
    staleTime: 1000 * 60 * 5,
  });

  // --- Fetch damage levels ---
  const { data: damageResponse, refetch: refetchDamage } = useQuery({
    queryKey: ["AppointmentPartCondition", data.id],
    queryFn: () => getAppointmentPartCondition(data.id),
    enabled: !!data.id,
    staleTime: 1000 * 60 * 5,
  });

  const damageLevels = useMemo(() => {
    const levels: Record<number, DamageLevelEnum> = {};

    if (!damageResponse?.data?.partDamageLevels) {
      return levels;
    }

    damageResponse.data.partDamageLevels.forEach((d) => {
      switch (d.damageLevel) {
        case "Minor":
          levels[d.partId] = DamageLevelEnum.Minor;
          break;
        case "Moderate":
          levels[d.partId] = DamageLevelEnum.Moderate;
          break;
        case "Severe":
          levels[d.partId] = DamageLevelEnum.Severe;
          break;
        case "Critical":
          levels[d.partId] = DamageLevelEnum.Critical;
          break;
        default:
          levels[d.partId] = DamageLevelEnum.NotAssessed;
      }
    });

    return levels;
  }, [damageResponse]);

  const handleAction = async (nextStatus: TechnicianWorkingSessionEnum) => {
    const prevStatus = currentStatus;
    setCurrentStatus(nextStatus);
    onStatusChange?.(data.orderId, nextStatus);

    try {
      await updateWorkingSession({
        orderId: data.orderId,
        status: nextStatus,
      });

      await queryClient.invalidateQueries({
        queryKey: ["TechnicianAddedParts", data.orderId],
      });
      await refetchParts();

      await queryClient.invalidateQueries({
        queryKey: ["AppointmentPartCondition", data.id],
      });
      await refetchDamage();

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
