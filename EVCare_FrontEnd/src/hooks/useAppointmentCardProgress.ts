// src/hooks/useAppointmentCardProgress.ts
import { useNotification } from "../context/useNotification";
import type { TechnicianAppointmentsDto } from "../models/AppointmentsModel/Technician_Appointments_Model";
import type { TechnicianWorkingSessionEnum } from "../models/enums";
import { DamageLevelEnum } from "../models/enums/DamageLevelEnum";
import { useQuery } from "@tanstack/react-query";
import { getTechnicianAddedParts } from "../services/getTechnicianOrder";
import { getAppointmentPartCondition } from "../services/appointmentPartCondition";
import { updateTechnicianWorkingSession } from "../services/TechnicianWorkingSessionApi";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import { useState } from "react";

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
  // --- Fetch added parts ---
  const { data: partsResponse, isLoading: isLoadingParts } = useQuery({
    queryKey: ["TechnicianAddedParts", data.orderId],
    queryFn: () => getTechnicianAddedParts(data.orderId),
    enabled: !!data.orderId,
    staleTime: 1000 * 60 * 5,
  });

  const parts = partsResponse?.data ?? [];

  // --- Fetch damage levels ---
  const { data: damageResponse } = useQuery({
    queryKey: ["AppointmentPartCondition", data.id],
    queryFn: () => getAppointmentPartCondition(data.id),
    enabled: !!data.id,
    staleTime: 1000 * 60 * 5,
  });

  const damageLevels: Record<number, DamageLevelEnum> = {};
  damageResponse?.data?.partDamageLevels?.forEach((d) => {
    switch (d.damageLevel) {
      case "Minor":
        damageLevels[d.partId] = DamageLevelEnum.Minor;
        break;
      case "Moderate":
        damageLevels[d.partId] = DamageLevelEnum.Moderate;
        break;
      case "Severe":
        damageLevels[d.partId] = DamageLevelEnum.Severe;
        break;
      case "Critical":
        damageLevels[d.partId] = DamageLevelEnum.Critical;
        break;
      default:
        damageLevels[d.partId] = DamageLevelEnum.NotAssessed;
    }
  });

  // --- Handle status update ---
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
