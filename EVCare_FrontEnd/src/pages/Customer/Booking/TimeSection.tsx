import React, { useCallback, useEffect, useState } from "react";
import { FormGroup, Label, Required, TimeInput, TimeInputGroup } from "./BookingForm.styled";
import { DatePicker, TimePicker } from "antd";
import { Dayjs } from "dayjs";
// import dayjs from "dayjs";
import { handleError } from "../../../utils/errorHandler";
import { getBlockedDate, getCenterInformation } from "../../../services/serviceCenterService";
import type { BlockedDateViewModel } from "../../../models/BlockedDate/BlockedDateViewModel";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Ho_Chi_Minh");

interface Props {
  date: Dayjs | undefined;
  time: Dayjs | undefined;
  handleSelectDate: (date: Dayjs | undefined) => void;
  handleSelectTime: (time: Dayjs | undefined) => void;
}

function TimeComponent({ date, time, handleSelectDate, handleSelectTime }: Props) {
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [listBlockedDays, setListBlockedDays] = useState<BlockedDateViewModel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response01 = await getCenterInformation();
        setStartTime(response01.data?.openTime ? dayjs(response01.data.openTime, "HH:mm:ss") : null);
        setEndTime(response01.data?.closeTime ? dayjs(response01.data.closeTime, "HH:mm:ss") : null);

        const response02 = await getBlockedDate();
        setListBlockedDays(response02.data ?? []);
      } catch (error) {
        handleError(error);
        alert(error);
      }
    };
    fetchData();
  }, []);

  const disableDate = useCallback(
    (current: Dayjs) => {
      if (!current) return false;
      const isPast = current.isBefore(dayjs().startOf("day"));
      const isBlocked = listBlockedDays.some((d) => current.isSame(dayjs(d.dateTime, "YYYY-MM-DD"), "day"));
      return isPast || isBlocked;
    },
    [listBlockedDays]
  );

  const disableTime = useCallback(
    (current: Dayjs) => {
      void current;
      const now = dayjs();
      const cutoff = now.add(1, "hour");
      return {
        disabledHours: () => {
          let hours = Array.from({ length: 24 }, (_, i) => i).filter(
            (h) => h > (endTime?.hour() ?? 0) || h <= (startTime?.hour() ?? 0)
          );
          if (current && current.isSame(now, "day")) {
            hours = [...hours, ...hours.filter((h) => h <= cutoff.hour())];
          }
          return hours;
        },
        disabledMinutes: (selectedHour?: number) => {
          const disabled: number[] = [];
          if (selectedHour == null) return [];

          // if (selectedHour === startTime?.hour()) {
          //   for (let m = 0; m < startTime.minute(); m++) disabled.push(m);
          //   return disabled;
          // }
          const cutoffStartDate = startTime?.add(1, "hour");
          if (selectedHour === cutoffStartDate?.hour()) {
            for (let m = 0; m < cutoffStartDate.minute(); m++) disabled.push(m);
            return disabled;
          }

          if (selectedHour === endTime?.hour()) {
            for (let m = 0; m < 60; m++) disabled.push(m);
            return disabled;
          }

          if (current && current.isSame(now, "day")) {
            if (selectedHour === cutoff.hour()) {
              for (let m = 0; m < cutoff.minute(); m++) disabled.push(m);
              return disabled;
            }
            if (selectedHour < cutoff.hour()) {
              return Array.from({ length: 60 }, (_, i) => i);
            }
          }
          return disabled;
        },
        disabledSeconds: () => {
          return [];
        },
      };
    },
    [startTime, endTime]
  );

  return (
    <FormGroup>
      <Label>
        Time <Required>*</Required>
      </Label>
      <TimeInputGroup>
        <TimeInput>
          <DatePicker
            getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
            onChange={(value) => handleSelectDate(value)}
            value={date}
            disabledDate={disableDate}
            dateRender={(current) => {
              const reason = listBlockedDays.find((item) => current.isSame(dayjs(item.dateTime), "day"))?.reason;

              return (
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    lineHeight: "24px",
                    textAlign: "center",
                    background: reason ? "#ffa39e" : undefined,
                  }}
                  title={reason}
                >
                  {current.date()}
                </div>
              );
            }}
          />
        </TimeInput>
        <TimeInput>
          <TimePicker
            showNow={false}
            getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
            type="time"
            onChange={(value) => handleSelectTime(value?.local() ?? undefined)}
            placeholder="Time"
            format="HH:mm"
            showSecond={false}
            minuteStep={15}
            value={time}
            hideDisabledOptions
            disabledTime={disableTime}
          />
        </TimeInput>
      </TimeInputGroup>
    </FormGroup>
  );
}

const TimeSection = React.memo(TimeComponent);
export default TimeSection;
