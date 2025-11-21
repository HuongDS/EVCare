import { DatePicker, Space } from "antd";
import styled from "styled-components";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const StyledRangePicker = styled(RangePicker)`
  &.ant-picker {
    border-radius: 8px;
    border-color: #e5e7eb;
    font-family: "Outfit", sans-serif !important;
    width: 100% !important;

    &:hover {
      border-color: #2563eb;
    }

    &.ant-picker-focused {
      border-color: #2563eb;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
    }
  }
`;

interface SortDateRangeProps {
  setBeginDate: (v: string) => void;
  setEndDate: (v: string) => void;
}

const SortDateRange = ({ setBeginDate, setEndDate }: SortDateRangeProps) => {
  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    console.log(dates);

    if (dates) {
      const [start, end] = dates;
      if (start && end) {
        setBeginDate(start.format("MM/DD/YYYY"));
        setEndDate(end.format("MM/DD/YYYY"));
      }
    } else {
      setBeginDate("");
      setEndDate("");
    }
  };

  const disabledDate = (current: Dayjs) => {
    return current > dayjs();
  };

  return (
    <Space size={12}>
      <StyledRangePicker
        size="middle"
        onChange={handleRangeChange}
        format="DD/MM/YYYY"
        placeholder={["Start Date", "End Date"]}
        style={{ width: "80px" }}
        disabledDate={disabledDate}
      />
    </Space>
  );
};

export default SortDateRange;
