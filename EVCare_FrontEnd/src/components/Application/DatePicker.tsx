// 📁 DatePicker.tsx
import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import dayjs from "dayjs";
import { BiCalendar } from "react-icons/bi";

const DateFieldWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 320px;
  font-family: "Outfit", sans-serif;
`;

const DateInput = styled.div<{ $hasError?: boolean }>`
  border: 2px solid ${({ $hasError }) => ($hasError ? "#dc2626" : "#e5e7eb")};
  border-radius: 12px;
  padding: 10px 14px;
  background: #fff;
  cursor: pointer;
  font-size: 15px;
  color: ${({ $hasError }) => ($hasError ? "#dc2626" : "#111827")};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;

  &:hover {
    border-color: #16a34a;
    box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.15);
  }
`;
const CalendarWrapper = styled.div`
  position: absolute;
  z-index: 50;
  top: 110%;
  left: 0;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 10px;
  overflow: hidden;

  .rdp {
    --rdp-cell-size: 40px;
    --rdp-accent-color: #16a34a;
    --rdp-background-color: #e6f7ec;
    font-family: "Outfit", sans-serif;
    color: #111827;
  }

  /* 🎯 Đổi màu mũi tên điều hướng (tương thích bản mới) */
  .rdp-nav_button {
    color: #16a34a !important;
  }

  .rdp-nav_button:hover {
    color: #15803d !important;
  }

  /* Một số phiên bản dùng SVG fill thay vì stroke */
  .rdp-nav_button svg path {
    fill: #16a34a !important;
  }

  .rdp-nav_button:hover svg path {
    fill: #15803d !important;
  }

  .rdp-day_selected {
    background-color: #16a34a !important;
    color: #fff !important;
    font-weight: 600;
  }

  .rdp-day_disabled {
    color: #9ca3af !important;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .rdp-day:hover:not(.rdp-day_disabled) {
    background: rgba(22, 163, 74, 0.1);
  }
`;

export default function DatePicker({
  value,
  onChange,
  validateDate,
  blockedDates,
  userDateOffs,
  center,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  validateDate: (val: string) => string | null;
  blockedDates: string[];
  userDateOffs: string[];
  center?: { workStartDay: string; workEndDay: string };
  error?: string | null;
}) {
  const [showCalendar, setShowCalendar] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    const formatted = dayjs(date).format("YYYY-MM-DD");
    onChange(formatted);
    const msg = validateDate(formatted);
    if (!msg) setShowCalendar(false);
  };

  const isDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const formatted = dayjs(date).format("YYYY-MM-DD");
    const diffDays = Math.floor(
      (date.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );
    const blocked =
      blockedDates.includes(formatted) || userDateOffs.includes(formatted);

    if (diffDays < 2 || diffDays > 31 || blocked) return true;

    if (center) {
      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const start = days.indexOf(center.workStartDay);
      const end = days.indexOf(center.workEndDay);
      const allowed = days.slice(start, end + 1);
      if (!allowed.includes(dayOfWeek)) return true;
    }

    return false;
  };

  return (
    <DateFieldWrapper ref={ref}>
      <DateInput
        $hasError={!!error}
        onClick={() => setShowCalendar(!showCalendar)}
      >
        {value || "Select a date"}
        <BiCalendar size={20} color="#16a34a" />
      </DateInput>

      {showCalendar && (
        <CalendarWrapper>
          <DayPicker
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={handleSelect}
            disabled={isDisabled}
          />
        </CalendarWrapper>
      )}
    </DateFieldWrapper>
  );
}
