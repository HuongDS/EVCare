import React, { useEffect, useState, type JSX } from "react";
import dayjs from "dayjs";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import type { EventInput, EventContentArg } from "@fullcalendar/core";
import LazyPerformanceSchedule from "./LazyPerformanceSchedule";

import { getTechnicianAppointments } from "../../../services/appointmentTechnicianApi";
import { getDateOff } from "../../../services/getApplicationApi";
import { getBlockedDate } from "../../../services/serviceCenterService";

import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import type { DateOffResponseDTO } from "../../../models/ApplicationModel/ApplicationModels";
import type { BlockedDateViewModel } from "../../../models/BlockedDate/BlockedDateViewModel";

import {
  ScheduleWrapper,
  ScheduleTitle,
  CalendarContainer,
  ErrorMessage,
} from "./Technician_Schedule.styled";

const TechnicianSchedule: React.FC = () => {
  const [appointments, setAppointments] = useState<TechnicianAppointmentsDto[]>(
    []
  );
  const [applications, setApplications] = useState<DateOffResponseDTO>([]);
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
      setAppointments(apptsRes.items ?? []);

      const dateOffRes = await getDateOff();
      setApplications(dateOffRes.data ?? []);

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

  const getStatusClass = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "appointment-completed";
      case "in-progress":
        return "appointment-progress";
      case "pending":
        return "appointment-pending";
      case "canceled":
        return "appointment-canceled";
      default:
        return "appointment";
    }
  };

  const events: EventInput[] = [
    ...appointments.map((a) => ({
      title: `Appointment\nOrder: ${a.orderId}\nCustomer: ${a.customerName}`,
      start: a.appointmentDate,
      className: getStatusClass(a.status),
      extendedProps: {
        orderId: a.orderId,
        customerName: a.customerName,
        status: a.status,
      },
    })),
    ...applications.map((d) => ({
      title: "Day Off",
      start: d,
      className: "dayOff",
      extendedProps: { reason: "Ngày nghỉ" },
    })),
    ...blockedDates.map((d) => ({
      title: d.reason || "Blocked",
      start: d.dateTime.format("YYYY-MM-DD"),
      className: "blocked",
      extendedProps: { reason: d.reason },
    })),
  ];

  const renderEventContent = (eventInfo: EventContentArg): JSX.Element => {
    const { event } = eventInfo;
    const isDayOff = event.classNames.includes("dayOff");
    const isBlocked = event.classNames.includes("blocked");

    const tooltipText =
      isDayOff || isBlocked
        ? event.extendedProps.reason || "Không có thông tin"
        : `Status: ${event.extendedProps.status || "N/A"}`;

    return (
      <Tippy content={tooltipText} placement="top" arrow={true}>
        <div>
          {event.title?.split("\n").map((line: string, idx: number) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      </Tippy>
    );
  };

  if (loading) return <ScheduleWrapper>Loading...</ScheduleWrapper>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <ScheduleWrapper>
      <ScheduleTitle>Technician Schedule</ScheduleTitle>
      <CalendarContainer>
        <LazyPerformanceSchedule
          events={events}
          renderEventContent={renderEventContent}
        />
      </CalendarContainer>
    </ScheduleWrapper>
  );
};

export default TechnicianSchedule;
