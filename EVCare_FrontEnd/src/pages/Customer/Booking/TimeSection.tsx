import React from "react";
import { FormGroup, Label, Required, TimeInput, TimeInputGroup } from "./BookingForm.styled";
import { DatePicker, TimePicker } from "antd";
import type { Dayjs } from "dayjs";

interface Props {
  date: Dayjs | undefined;
  time: Dayjs | undefined;
  handleSelectDate: (date: Dayjs | undefined) => void;
  handleSelectTime: (time: Dayjs | undefined) => void;
}

function TimeComponent({ date, time, handleSelectDate, handleSelectTime }: Props) {
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
          />
        </TimeInput>
        <TimeInput>
          <TimePicker
            getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
            type="time"
            onChange={(value) => handleSelectTime(value)}
            placeholder="Time"
            format="HH:mm"
            showSecond={false}
            minuteStep={5}
            value={time}
          />
        </TimeInput>
      </TimeInputGroup>
    </FormGroup>
  );
}

const TimeSection = React.memo(TimeComponent);
export default TimeSection;
