import React, { Suspense, type JSX } from "react";
const FullCalendar = React.lazy(() => import("@fullcalendar/react"));

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import type { EventInput, EventContentArg } from "@fullcalendar/core";

interface LazyPerformanceScheduleProps {
  events: EventInput[];
  renderEventContent: (eventInfo: EventContentArg) => JSX.Element;
}

const LazyPerformanceSchedule: React.FC<LazyPerformanceScheduleProps> = ({
  events,
  renderEventContent,
}) => {
  return (
    <Suspense
      fallback={<div style={{ textAlign: "center" }}>Loading Calendar...</div>}
    >
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
    </Suspense>
  );
};

export default LazyPerformanceSchedule;
