import { useState } from "react";
import SortTable from "../Technician_Component/SortTable";
import Input from "../Technician_Component/SearchBar";
import styled from "styled-components";
import AppointmentCard from "../Technician_Component/AppointmentCard";
import { useGetTechnicianAppointments } from "./Technician_General_API";
import { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";

const AppointmentWrapper = styled.div``;

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

export default function Technician_General() {
  const [activeStatus, setActiveStatus] = useState<number | "All">("All");

  // Gọi API, bỏ qua Status nếu đang chọn "All"
  const { data, isSuccess, isLoading, isError } = useGetTechnicianAppointments(
    activeStatus === "All" ? undefined : activeStatus
  );

  const name = TechnicianWorkingSessionEnum;

  const sortName = [
    "All",
    name.PENDING,
    name.INPROGRESS,
    name.ADDING_PART,
    name.COMPLETED,
    name.CANCELLED,
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading technician appointments</div>;

  return (
    <AppointmentWrapper>
      <TitleWrapper>
        <h2>Technician Jobs</h2>
        <Input />
      </TitleWrapper>

      <SortTable
        sortName={sortName}
        active={activeStatus}
        onChange={setActiveStatus}
      />

      <div>
        {isSuccess &&
          data?.data?.items?.map((item: TechnicianAppointmentsDto) => (
            <AppointmentCard key={item.id} data={item} />
          ))}
      </div>
    </AppointmentWrapper>
  );
}
