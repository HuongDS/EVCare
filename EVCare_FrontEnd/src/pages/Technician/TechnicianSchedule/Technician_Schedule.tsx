import React, { useMemo } from "react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import type { EventInput, EventContentArg } from "@fullcalendar/core";
import LazyPerformanceSchedule from "./LazyPerformanceSchedule";

import { useGetTechnicianAppointments } from "../../../services/appointmentTechnicianApi";
import { getDateOff } from "../../../services/getApplicationApi";
import { getBlockedDate } from "../../../services/serviceCenterService";

import type { BlockedDateViewModel } from "../../../models/BlockedDate/BlockedDateViewModel";
import { TechnicianWorkingSessionEnum } from "../../../models/enums";

import {
  ScheduleWrapper,
  ScheduleTitle,
  CalendarContainer,
  ErrorMessage,
} from "./Technician_Schedule.styled";

type SimpleAppointment = {
  id: number;
  appointmentDate: string;
  status: string;
  vehicleModel: string;
  extraProps: Record<string, unknown>;
};

const TechnicianSchedule: React.FC = () => {
  const commonParams = { PageSize: 100, PageIndex: 1 };

  const queryPending = useGetTechnicianAppointments({
    Status: String(TechnicianWorkingSessionEnum.PENDING),
    ...commonParams,
  });
  const queryInProgress = useGetTechnicianAppointments({
    Status: String(TechnicianWorkingSessionEnum.INPROGRESS),
    ...commonParams,
  });
  const queryAddingPart = useGetTechnicianAppointments({
    Status: String(TechnicianWorkingSessionEnum.ADDING_PART),
    ...commonParams,
  });
  const queryConfirm = useGetTechnicianAppointments({
    Status: String(TechnicianWorkingSessionEnum.CONFIRM),
    ...commonParams,
  });
  const queryCompleted = useGetTechnicianAppointments({
    Status: String(TechnicianWorkingSessionEnum.COMPLETED),
    ...commonParams,
  });
  const queryCanceled = useGetTechnicianAppointments({
    Status: String(TechnicianWorkingSessionEnum.CANCELED),
    ...commonParams,
  });

  const appointmentQueries = [
    queryPending,
    queryInProgress,
    queryAddingPart,
    queryConfirm,
    queryCompleted,
    queryCanceled,
  ];

  const {
    data: applications = [],
    isLoading: isLoadingDateOff,
    error: errorDateOff,
  } = useQuery<Date[]>({
    queryKey: ["dateOff"],
    queryFn: async () => {
      const res = await getDateOff();
      const raw = res?.data;

      if (!Array.isArray(raw)) return [];

      return raw
        .filter((d): d is string => typeof d === "string")
        .map((d) => new Date(d));
    },
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: blockedDates = [],
    isLoading: isLoadingBlocked,
    error: errorBlocked,
  } = useQuery<BlockedDateViewModel[]>({
    queryKey: ["blockedDates"],
    queryFn: async () => {
      const res = await getBlockedDate();
      const raw = res?.data;

      const list = Array.isArray(raw)
        ? raw
        : raw && typeof raw === "object"
        ? Object.values(raw)
        : [];

      return list
        .filter(
          (d): d is { dateTime: string; reason: string } =>
            typeof d === "object" &&
            d !== null &&
            "dateTime" in d &&
            typeof (d as any).dateTime === "string"
        )
        .map((d) => ({
          dateTime: dayjs(d.dateTime),
          reason: d.reason,
        }));
    },
    staleTime: 1000 * 60 * 5,
  });

  const loading =
    appointmentQueries.some((q) => q.isLoading) ||
    isLoadingDateOff ||
    isLoadingBlocked;

  const firstError =
    appointmentQueries.find((q) => q.error)?.error ||
    errorDateOff ||
    errorBlocked;

  const appointments: SimpleAppointment[] = useMemo(() => {
    const allAppointments = appointmentQueries.flatMap(
      (q) => q.data?.items ?? []
    );

    return allAppointments.map((a) => ({
      id: a.id,
      appointmentDate: a.appointmentDate,
      status: a.status,
      vehicleModel: a.vehicleModel,
      extraProps: { ...a },
    }));
  }, [
    queryPending.data,
    queryInProgress.data,
    queryAddingPart.data,
    queryConfirm.data,
    queryCompleted.data,
    queryCanceled.data,
  ]);

  const events: EventInput[] = useMemo(() => {
    const safeBlockedDates = Array.isArray(blockedDates) ? blockedDates : [];

    return [
      ...appointments.map((a) => ({
        title: `ID: ${a.id}\n${a.vehicleModel}\n${a.status}`,
        start: dayjs(a.appointmentDate).toDate(),
        className: `appointment ${a.status?.toLowerCase()}`,
        extendedProps: a.extraProps,
      })),
      ...applications.map((d) => ({
        title: "Day Off",
        start: d,
        className: "dayOff",
        extendedProps: { reason: "Day Off" },
      })),
      ...safeBlockedDates.map((d) => ({
        title: d.reason || "Blocked",
        start: d.dateTime.toDate(),
        className: "blocked",
        extendedProps: { reason: d.reason },
      })),
    ];
  }, [appointments, applications, blockedDates]);

  const renderEventContent = (eventInfo: EventContentArg) => (
    <div>
      {eventInfo.event.title?.split("\n").map((line, idx) => (
        <span key={idx} style={{ display: "block" }}>
          {line}
        </span>
      ))}
    </div>
  );

  return (
    <ScheduleWrapper>
      <ScheduleTitle>Technician Schedule</ScheduleTitle>

      {loading && <div>Loading...</div>}
      {firstError && (
        <ErrorMessage>
          {(firstError as Error)?.message || "Failed to load schedule data"}
        </ErrorMessage>
      )}

      {!loading && !firstError && (
        <CalendarContainer>
          <LazyPerformanceSchedule
            events={events}
            renderEventContent={renderEventContent}
          />
        </CalendarContainer>
      )}
    </ScheduleWrapper>
  );
};

export default TechnicianSchedule;
