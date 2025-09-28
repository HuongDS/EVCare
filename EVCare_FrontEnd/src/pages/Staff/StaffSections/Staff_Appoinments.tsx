import SortTable from "../StaffComponents/SortTable";
import { AppointmentStatusEnum } from "../../../models/enums";
import Input from "../StaffComponents/SearchBar";
import styled from "styled-components";

const AppoimentWrapper = styled.div``;

const TitleWrapper = styled.div`
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-weight: 600;
    color: #4caf50;
  }
`;

export default function Staff_Appoinments() {
  const name = AppointmentStatusEnum;
  const sortName = [
    name.PENDING,
    name.CHECKED_IN,
    name.CONFIRMED,
    name.IN_PROGRESS,
    name.DONE,
    name.CANCELLED,
  ];
  return (
    <AppoimentWrapper>
      <TitleWrapper>
        <h2>Appoinments</h2>
        <Input />
      </TitleWrapper>
      <SortTable sortName={sortName} />
      <div></div>
    </AppoimentWrapper>
  );
}
