import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

import type { EventInput, EventContentArg } from "@fullcalendar/core";
import LazyPerformanceSchedule from "./LazyPerformanceSchedule";

import { getTechnicianAppointments } from "../../../services/appointmentTechnicianApi";
import { getDateOff } from "../../../services/getApplicationApi";
import { getBlockedDate } from "../../../services/serviceCenterService";

import type { BlockedDateViewModel } from "../../../models/BlockedDate/BlockedDateViewModel";

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
    try {
      const apptsRes = await getTechnicianAppointments({
        PageSize: 100,
        PageIndex: 1,
      });
      const filteredAppointments = (apptsRes.items ?? [])
        .filter((a) =>
          ["pending", "in-progress"].includes(a.status.toLowerCase())
        )
        .map((a) => ({
          id: a.id,
          appointmentDate: a.appointmentDate,
          status: a.status,
          vehicleModel: a.vehicleModel,
          extraProps: { ...a },
        }));
      setAppointments(filteredAppointments);

      const dateOffRes = await getDateOff();
      // map về Date object
      setApplications((dateOffRes.data ?? []).map((d) => new Date(d)));

      const blockedRes = await getBlockedDate();
      setBlockedDates(
        (blockedRes.data ?? []).map((d) => ({
          ...d,
          dateTime: dayjs(d.dateTime),
        }))
      );
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || "Failed to load schedule data");
    } finally {
      setLoading(false);
    }
  };

  const events: EventInput[] = [
    ...appointments.map((a) => ({
      title: `ID: ${a.id}\n${a.vehicleModel}\n${a.status}`,
      start: new Date(a.appointmentDate),
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

  // 🔹 renderEventContent bỏ Tippy, chỉ hiển thị text
  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <div>
        {eventInfo.event.title?.split("\n").map((line, idx) => (
          <span key={idx} style={{ display: "block" }}>
            {line}
          </span>
        ))}
      </div>
    );
  };

  return (
    <ScheduleWrapper>
      <ScheduleTitle>Technician Schedule</ScheduleTitle>
      {loading && <div style={{ textAlign: "center" }}>Loading...</div>}
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
