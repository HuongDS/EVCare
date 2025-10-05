import { useEffect, useState, useCallback } from "react";
import AppointmentCard from "../Technician_Component/AppointmentCard";
import LoadingOverlay from "../Technician_Component/LoadingOverlay";
import SortTable from "../Technician_Component/SortTable";

import {
  AppointmentWrapper,
  TitleWrapper,
  Title,
  AppointmentList,
} from "./Technician_General.styled";

import styled from "styled-components";
import { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { getTechnicianAppointments } from "../../../services/appointmentTechnicianApi";

// Watermark khi không có appointment
const Watermark = styled.div`
  padding: 60px 0;
  text-align: center;
  color: rgba(0, 0, 0, 0.2);
  font-size: 1.8rem;
  font-weight: bold;
  pointer-events: none;
  user-select: none;
`;

export default function Technician_General() {
  const [activeStatus, setActiveStatus] =
    useState<TechnicianWorkingSessionEnum>(
      TechnicianWorkingSessionEnum.PENDING
    );
  const [appointments, setAppointments] = useState<TechnicianAppointmentsDto[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [fade, setFade] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setFade(true);
    try {
      const data = await getTechnicianAppointments({
        status: activeStatus,
        pageSize: 1000,
        pageIndex: 1,
      });
      setAppointments(data.items ?? []);
    } catch (e) {
      setIsError(true);
      console.error(e);
    } finally {
      setTimeout(() => setFade(false), 50);
      setIsLoading(false);
    }
  }, [activeStatus]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleUpdateStatus = (
    orderId: number,
    newStatus: TechnicianWorkingSessionEnum
  ) => {
    setAppointments((prev) =>
      prev.map((a) => (a.orderId === orderId ? { ...a, status: newStatus } : a))
    );

    if (activeStatus !== newStatus) {
      setActiveStatus(newStatus);
    }
  };

  const sortName: TechnicianWorkingSessionEnum[] = [
    TechnicianWorkingSessionEnum.PENDING,
    TechnicianWorkingSessionEnum.INPROGRESS,
    TechnicianWorkingSessionEnum.ADDING_PART,
    TechnicianWorkingSessionEnum.COMPLETED,
    TechnicianWorkingSessionEnum.CANCELLED,
  ];

  return (
    <AppointmentWrapper>
      {isLoading && <LoadingOverlay />}
      <TitleWrapper>
        <Title>Technician Jobs</Title>
      </TitleWrapper>
      <SortTable
        sortName={sortName}
        active={activeStatus}
        onChange={setActiveStatus}
      />
      {isError ? (
        <div>Error loading technician appointments</div>
      ) : appointments.length === 0 ? (
        <Watermark>No appointments here</Watermark>
      ) : (
        <AppointmentList className={fade ? "fade-out" : ""}>
          {appointments.map((item) => (
            <AppointmentCard
              key={item.id}
              data={item}
              onStatusChange={handleUpdateStatus}
            />
          ))}
        </AppointmentList>
      )}
    </AppointmentWrapper>
  );
}
