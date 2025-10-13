// DatePicker.tsx
import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import dayjs from "dayjs";
import { Field } from "./ApplicationForm.styled";
import { BiCalendar } from "react-icons/bi";

const DateInput = styled.div<{ hasError?: boolean }>`
  border: 1px solid ${({ hasError }) => (hasError ? "#dc2626" : "#ccc")};
  border-radius: 10px;
  padding: 10px 12px;
  background: #f9fafb;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.1);
  }
`;

const CalendarWrapper = styled.div`
  position: absolute;
  z-index: 100;
  margin-top: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: #fff;
  border-radius: 10px;
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
  error?: string | null; // nhận error từ Form
}) {
  const [showCalendar, setShowCalendar] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close popup khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    const formatted = dayjs(date).format("YYYY-MM-DD");
    const msg = validateDate(formatted);
    if (!msg) {
      onChange(formatted);
      setShowCalendar(false);
    } else {
      // vẫn gọi onChange để set giá trị, lỗi sẽ hiển thị ở Form
      onChange(formatted);
    }
  };

  const isDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const formatted = dayjs(date).format("YYYY-MM-DD");
    const blocked =
      blockedDates.includes(formatted) || userDateOffs.includes(formatted);

    const diffDays = Math.floor(
      (date.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );

    if (diffDays < 2 || diffDays > 31 || blocked) return true;

    if (center) {
      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
      const workDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const startIndex = workDays.indexOf(center.workStartDay);
      const endIndex = workDays.indexOf(center.workEndDay);
      const allowedDays = workDays.slice(startIndex, endIndex + 1);
      if (!allowedDays.includes(dayOfWeek)) return true;
    }

    return false;
  };

  return (
    <Field style={{ position: "relative" }} ref={ref}>
      <DateInput
        onClick={() => setShowCalendar((prev) => !prev)}
        hasError={!!error}
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
    </Field>
  );
}
