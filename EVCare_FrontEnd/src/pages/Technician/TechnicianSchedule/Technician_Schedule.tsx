import React, { useMemo } from "react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query"; // Vẫn cần cho 2 hook kia

import type { EventInput, EventContentArg } from "@fullcalendar/core";
import LazyPerformanceSchedule from "./LazyPerformanceSchedule";

// 1. Import hook mới của bạn
import { useGetTechnicianAppointments } from "../../../services/appointmentTechnicianApi";
import { getDateOff } from "../../../services/getApplicationApi";
import { getBlockedDate } from "../../../services/serviceCenterService";

import type { BlockedDateViewModel } from "../../../models/BlockedDate/BlockedDateViewModel";
import { TechnicianWorkingSessionEnum } from "../../../models/enums"; // Import Enum

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
  // 2. Xóa useEffect và useState. Gọi 6 hook cho 6 trạng thái
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

  // Mảng chứa kết quả của 6 query trên
  const appointmentQueries = [
    queryPending,
    queryInProgress,
    queryAddingPart,
    queryConfirm,
    queryCompleted,
    queryCanceled,
  ];

  // 3. Vẫn dùng useQuery cho Date Off và Blocked Dates
  const {
    data: applications = [],
    isLoading: isLoadingDateOff,
    error: errorDateOff,
  } = useQuery({
    queryKey: ["dateOff"],
    queryFn: async () => {
      const res = await getDateOff();
      return (res.data ?? []).map((d: string) => new Date(d));
    },
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: blockedDates = [],
    isLoading: isLoadingBlocked,
    error: errorBlocked,
  } = useQuery({
    queryKey: ["blockedDates"],
    queryFn: async () => {
      const res = await getBlockedDate();
      return (res.data ?? []).map((d: BlockedDateViewModel) => ({
        ...d,
        dateTime: dayjs(d.dateTime),
      }));
    },
    staleTime: 1000 * 60 * 5,
  });

  // 4. Gộp chung state loading và error
  const loading =
    appointmentQueries.some((q) => q.isLoading) ||
    isLoadingDateOff ||
    isLoadingBlocked;

  const firstError =
    appointmentQueries.find((q) => q.error)?.error ||
    errorDateOff ||
    errorBlocked;

  // 5. Dùng useMemo để gộp data từ 6 hook
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
    // Thêm dependencies là data của 6 hook
  }, [
    queryPending.data,
    queryInProgress.data,
    queryAddingPart.data,
    queryConfirm.data,
    queryCompleted.data,
    queryCanceled.data,
  ]);

  // 6. useMemo cho events (như cũ)
  const events: EventInput[] = useMemo(
    () => [
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
      ...blockedDates.map((d) => ({
        title: d.reason || "Blocked",
        start: d.dateTime.toDate(),
        className: "blocked",
        extendedProps: { reason: d.reason },
      })),
    ],
    [appointments, applications, blockedDates]
  );

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
