// Technician_Schedule.styled.ts
import styled from "styled-components";

const COLORS = {
  primary: "#4caf50",
  grayDark: "#222",
  grayMedium: "#666",
  grayLight: "#f5f5f5",
  error: "#e53935",
  appointment: "#52c41a",
  dayOff: "#fa8c16",
  blocked: "#ff4d4f",
};

const BREAKPOINTS = {
  desktop: "1024px",
  tablet: "768px",
  mobile: "480px",
};

/* 📦 Wrapper tổng thể */
export const ScheduleWrapper = styled.div`
  padding: 24px;
  background: ${COLORS.grayLight};
  min-height: 100vh;
  font-family: "Outfit", sans-serif;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    padding: 16px;
  }
`;

/* 🏷️ Tiêu đề */
export const ScheduleTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: ${COLORS.primary};
  text-align: center;
  margin-bottom: 24px;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    font-size: 1.8rem;
  }
`;

/* 📅 Calendar container */
export const CalendarContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);a
  font-family: "Outfit", sans-serif;

  /* Header (Mon, Tue...) */
  .fc-col-header-cell,
  .fc-col-header-cell-cushion {
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    color: #222;
  }

  /* Numbers of days */
  .fc-daygrid-day-number {
    font-family: "Outfit", sans-serif;
    font-weight: 500;
    color: #222;
  }

  /* Events */
  .fc-daygrid-event {
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    padding: 4px 6px;
    color: #fff;
    text-align: left;
    font-family: "Outfit", sans-serif;
    white-space: normal;
    overflow: visible;
    word-break: break-word;
  }

  .appointment {
    background-color: #52c41a !important;
    border-color: #52c41a !important;
  }

  .dayOff {
    background-color: #fa8c16 !important;
    border-color: #fa8c16 !important;
  }

  .blocked {
    background-color: #ff4d4f !important;
    border-color: #ff4d4f !important;
  }
`;

/* ⚠️ Thông báo lỗi */
export const ErrorMessage = styled.div`
  color: ${COLORS.error};
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  margin-top: 20px;
`;
