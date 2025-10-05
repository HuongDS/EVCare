import SortTable from "../StaffComponents/SortTable";
import { AppointmentStatusEnum } from "../../../models/enums";
import styled from "styled-components";
import AppointmentCard from "../StaffComponents/AppointmentCard";
import { useGetAllAppointments } from "../../../services/appointmentServiceApi";
import type { StaffAppointmentsDto } from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import SearchBar from "../../../components/SearchBar/Search";
import SpinnerComponent from "../../../components/SpinnerComponent";

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
  const { data: appointments, isLoading } = useGetAllAppointments({
    status: "Confirmed",
  });

  if (isLoading) return <SpinnerComponent />;
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
        <SearchBar
          placeholder="Search appointments..."
          handleSearchValue={() => 1}
        />
      </TitleWrapper>
      <SortTable sortName={sortName} />
      <div>
        {appointments?.data?.items?.map((item: StaffAppointmentsDto) => (
          <AppointmentCard key={item.id} data={item} />
        ))}
      </div>
    </AppoitmentWrapper>
  );
}
