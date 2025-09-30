import SortTable from "../StaffComponents/SortTable";
import { AppointmentStatusEnum } from "../../../models/enums";
import Input from "../StaffComponents/SearchBar";
import styled from "styled-components";
import AppointmentCard from "../StaffComponents/AppointmentCard";
import { useGetAllAppointments } from "../../../services/appointmentServiceApi";
import type { StaffAppointmentsDto } from "../../../models/AppointmentsModel/Staff_Appointments_Model";

const AppoitmentWrapper = styled.div``;

const TitleWrapper = styled.div`
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    color: #4caf50;
  }
`;

export default function Staff_Appoinments() {
  const name = AppointmentStatusEnum;
  const { data, isSuccess, isLoading, isError } = useGetAllAppointments();
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading appointments</div>;
  const sortName = [
    "All",
    name.PENDING,
    name.CHECKED_IN,
    name.CONFIRMED,
    name.IN_PROGRESS,
    name.DONE,
    name.CANCELLED,
  ];
  return (
    <AppoitmentWrapper>
      <TitleWrapper>
        <h2>Appoinments</h2>
        <Input />
      </TitleWrapper>
      <SortTable sortName={sortName} />
      <div>
        {isSuccess &&
          data?.data?.items?.map((item: StaffAppointmentsDto) => (
            <AppointmentCard key={item.id} data={item} />
          ))}
      </div>
    </AppoitmentWrapper>
  );
}
