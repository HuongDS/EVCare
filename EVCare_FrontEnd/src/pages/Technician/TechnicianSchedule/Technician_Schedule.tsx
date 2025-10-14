import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

import type { EventInput, EventContentArg } from "@fullcalendar/core";
import LazyPerformanceSchedule from "./LazyPerformanceSchedule";

import { getTechnicianAppointments } from "../../../services/appointmentTechnicianApi";
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
  const [appointments, setAppointments] = useState<SimpleAppointment[]>([]);
  const [applications, setApplications] = useState<Date[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDateViewModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // --- Fetch appointments chỉ với 1 request (nếu backend hỗ trợ)
      const activeStatuses = [
        TechnicianWorkingSessionEnum.PENDING,
        TechnicianWorkingSessionEnum.INPROGRESS,
        TechnicianWorkingSessionEnum.ADDING_PART,
      ];

      const appointmentRes = await getTechnicianAppointments({
        Status: activeStatuses.join(","), // backend phải hỗ trợ CSV
        PageSize: 100,
        PageIndex: 1,
      });

      const mappedAppointments: SimpleAppointment[] = (
        appointmentRes.items ?? []
      ).map((a) => ({
        id: a.id,
        appointmentDate: a.appointmentDate,
        status: a.status,
        vehicleModel: a.vehicleModel,
        extraProps: { ...a },
      }));

      setAppointments(mappedAppointments);

      // --- Fetch date off và blocked dates song song
      const [dateOffRes, blockedRes] = await Promise.all([
        getDateOff(),
        getBlockedDate(),
      ]);

      setApplications((dateOffRes.data ?? []).map((d) => new Date(d)));

      setBlockedDates(
        (blockedRes.data ?? []).map((d) => ({
          ...d,
          dateTime: dayjs(d.dateTime),
        }))
      );
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error)?.message || "Failed to load schedule data");
    } finally {
      setLoading(false);
    }
  };

  // --- Map events chỉ 1 lần, gọn hơn
  const events: EventInput[] = [
    ...appointments.map((a) => ({
      title: `ID: ${a.id}\n${a.vehicleModel}\n${a.status}`,
      start: dayjs(a.appointmentDate).toDate(),
      className: "appointment",
      extendedProps: a.extraProps,
    })),
    ...applications.map((d) => ({
      title: "Day Off",
      start: d,
      className: "dayOff",
      extendedProps: { reason: "Ngày nghỉ" },
    })),
    ...blockedDates.map((d) => ({
      title: d.reason || "Blocked",
      start: d.dateTime.toDate(),
      className: "blocked",
      extendedProps: { reason: d.reason },
    })),
  ];

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
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!loading && !error && (
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
