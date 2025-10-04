import { useEffect, useState, useMemo } from "react";
import SortTable from "../Technician_Component/SortTable";
import styled from "styled-components";
import AppointmentCard from "../Technician_Component/AppointmentCard";

import { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { getTechnicianAppointments } from "../../../services/appointmentTechnicianApi";

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
  const [activeStatus, setActiveStatus] = useState<number | "To Do List">(
    "To Do List"
  );
  const [appointments, setAppointments] = useState<TechnicianAppointmentsDto[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const data = await getTechnicianAppointments({
          pageSize: 1000,
          pageIndex: 1,
        });
        setAppointments(data.items ?? []);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const name = TechnicianWorkingSessionEnum;

  const sortName = [
    "To Do List",
    name.PENDING,
    name.INPROGRESS,
    name.ADDING_PART,
    name.COMPLETED,
    name.CANCELLED,
  ];

  const filteredAppointments = useMemo(() => {
    if (activeStatus === "To Do List") return appointments;
    return appointments.filter((item) => item.status === activeStatus);
  }, [appointments, activeStatus]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading technician appointments</div>;

  return (
    <AppointmentWrapper>
      <TitleWrapper>
        <h2>Technician Jobs</h2>
      </TitleWrapper>

      <SortTable
        sortName={sortName}
        active={activeStatus}
        onChange={setActiveStatus}
      />

      <div>
        {filteredAppointments.map((item) => (
          <AppointmentCard key={item.id} data={item} />
        ))}
      </div>
    </AppointmentWrapper>
  );
}
