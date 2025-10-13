// Technician_Schedule.tsx
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventInput, EventContentArg } from "@fullcalendar/core";
import dayjs from "dayjs";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

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

  const events: EventInput[] = [
    ...appointments.map((a) => ({
      title: `Appointment\nOrder: ${a.orderId}\nCustomer: ${a.customerName}`,
      start: a.appointmentDate,
      className: "appointment",
      extendedProps: { orderId: a.orderId, customerName: a.customerName },
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

  const renderEventContent = (eventInfo: EventContentArg) => {
    const isDayOff = eventInfo.event.classNames.includes("dayOff");
    const isBlocked = eventInfo.event.classNames.includes("blocked");

    let popoverContent = "";
    if (isDayOff)
      popoverContent = eventInfo.event.extendedProps.reason || "Ngày nghỉ";
    if (isBlocked)
      popoverContent = eventInfo.event.extendedProps.reason || "Blocked";

    return (
      <Tippy content={popoverContent} placement="top" arrow={true}>
        <div>
          {eventInfo.event.title?.split("\n").map((line, idx) => (
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
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          eventContent={renderEventContent}
          height="auto"
          dayMaxEvents={false}
        />
      </CalendarContainer>
    </ScheduleWrapper>
  );
};

export default TechnicianSchedule;
