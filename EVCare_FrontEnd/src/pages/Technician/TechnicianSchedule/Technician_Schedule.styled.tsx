import styled from "styled-components";

const COLORS = {
  primary: "#4caf50",
  grayLight: "#f5f5f5",
  appointment: "#52c41a",
  dayOff: "#fa8c16",
  blocked: "#ff4d4f",
  error: "#e53935",
};

export const ScheduleWrapper = styled.div`
  padding: 24px;
  background: ${COLORS.grayLight};
  min-height: 100vh;
  font-family: "Outfit", sans-serif;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const ScheduleTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: ${COLORS.primary};
  text-align: center;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const CalendarContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-family: "Outfit", sans-serif;
  overflow: visible;
  position: relative;
  overflow-x: auto;

  /* FullCalendar toolbar buttons */
  .fc-button {
    background-color: ${COLORS.primary};
    border: none;
    color: #fff;
    font-weight: 600;
    border-radius: 6px;
    padding: 4px 10px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .fc-button:hover {
    background-color: #45a049;
  }

  .fc-button:focus {
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.5);
  }

  .fc-button:active,
  .fc-button.fc-button-active {
    background-color: #388e3c !important;
    color: #fff !important;
    box-shadow: none !important;
  }

  /* Tháng/năm */
  .fc-toolbar-title {
    color: ${COLORS.primary};
    font-weight: 700;
    font-size: 1.5rem;

    @media (max-width: 768px) {
      font-size: 1.3rem;
    }

    @media (max-width: 480px) {
      font-size: 1.1rem;
    }
  }

  /* Tên thứ trong lịch */
  .fc-col-header-cell-cushion {
    color: #222;
    font-weight: 600;
    text-decoration: none;
    font-size: 0.95rem;

    @media (max-width: 768px) {
      font-size: 0.85rem;
    }

    @media (max-width: 480px) {
      font-size: 0.75rem;
    }
  }

  /* Số ngày trong tháng */
  .fc-daygrid-day-number {
    color: #222;
    font-weight: 500;
    text-decoration: none;
    font-size: 0.9rem;

    @media (max-width: 768px) {
      font-size: 0.8rem;
    }

    @media (max-width: 480px) {
      font-size: 0.7rem;
    }
  }

  /* Timeline week/day: giờ màu đen */
  .fc-timegrid-axis-cushion {
    color: #222;
    font-weight: 500;
    font-size: 0.8rem;

    @media (max-width: 768px) {
      font-size: 0.7rem;
    }

    @media (max-width: 480px) {
      font-size: 0.65rem;
    }
  }

  /* Grid background cho week/day */
  .fc-timegrid-col-frame {
    border-left: 1px solid #e0e0e0;
  }

  /* Event styling */
  .fc-daygrid-event,
  .fc-timegrid-event {
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    padding: 4px 6px;
    color: #fff;
    text-align: left;
    white-space: normal;
    overflow: visible;
    word-break: break-word;
    position: relative;
    z-index: 1;

    @media (max-width: 768px) {
      font-size: 0.8rem;
      padding: 3px 5px;
    }

    @media (max-width: 480px) {
      font-size: 0.7rem;
      padding: 2px 4px;
    }
  }

  .fc-day-today {
    background-color: #e8f5e9 !important;
  }

  .appointment {
    background-color: ${COLORS.appointment} !important;
    border-color: ${COLORS.appointment} !important;
  }

  .dayOff {
    background-color: ${COLORS.dayOff} !important;
    border-color: ${COLORS.dayOff} !important;
  }

  .blocked {
    background-color: ${COLORS.blocked} !important;
    border-color: ${COLORS.blocked} !important;
  }
`;

export const ErrorMessage = styled.div`
  color: ${COLORS.error};
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  margin-top: 20px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;
