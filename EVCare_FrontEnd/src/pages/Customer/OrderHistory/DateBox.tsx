import styled from "styled-components";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

interface DateBoxProps {
  label?: string;
  date?: string;
}

export default function DateBox({ date }: DateBoxProps) {
  const [value] = useState<Dayjs | null>(date ? dayjs(date) : dayjs());

  return (
    <Wrapper>
      <Box>
        <Icon>
          <i className="bi bi-calendar"></i>
        </Icon>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StyledDateField value={value} disabled format="DD/MM/YYYY" />
        </LocalizationProvider>
      </Box>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  background: #f2f4f3;
  border-radius: 8px;
  font-size: 1em;
  width: 100%;
  padding: 5px 14px;
  text-align: left;
  font-family: "Outfit", sans-serif;
  box-sizing: border-box;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const StyledDateField = styled(DateField)`
  flex: 1;

  & .MuiInputBase-root {
    font-size: 1em;
    font-family: "Outfit", sans-serif;
    background: transparent !important;
    padding: 0 !important;
    height: auto;
  }

  & fieldset {
    border: none !important;
    padding: 0 !important;
  }

  & input {
    padding: 0 !important;
    text-align: left;
    font-family: "Outfit", sans-serif;
    font-size: 1em;
    font-weight: 400;
    height: auto;
    line-height: normal;
  }

  & .Mui-disabled {
    -webkit-text-fill-color: #000;
    opacity: 1;
  }

  & .MuiPickersSectionList-root {
    background-color: #f2f4f3;
    border-radius: 8px;
    padding: 0;
    font-size: 1em;
  }

  & .MuiPickersSection-root {
    padding: 0;
    text-align: center;
  }

  & .MuiPickersInputBase-root {
    padding: 0 0 0 5%;
  }
`;
const Icon = styled.div`
  font-size: 1.2em;
  color: #555;
  padding-bottom: 1%;
`;
