import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppointmentCard from "../Technician_Component/AppointmentCard";
import LoadingOverlay from "../Technician_Component/LoadingOverlay";
import SortTable from "../Technician_Component/SortTable";

import {
  AppointmentWrapper,
  TitleWrapper,
  Title,
  AppointmentList,
  Watermark,
  ErrorMessage,
} from "./Technician_General.styled";

import { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { getTechnicianAppointments } from "../../../services/appointmentTechnicianApi";

export default function Technician_General() {
  const location = useLocation();
  const navigate = useNavigate();

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

  // --- fetchAppointments định nghĩa sớm, tránh lỗi "used before declared"
  const fetchAppointments = useCallback(
    async (statusOverride?: TechnicianWorkingSessionEnum) => {
      const statusToFetch = statusOverride ?? activeStatus;
      setIsLoading(true);
      setIsError(false);
      setFade(true);
      try {
        const data = await getTechnicianAppointments({
          Status: statusToFetch,
          PageSize: 1000,
          PageIndex: 1,
        });
        setAppointments(data.items ?? []);
      } catch (e) {
        console.error("Failed to fetch appointments", e);
        setIsError(true);
      } finally {
        setTimeout(() => setFade(false), 80);

        setIsLoading(false);
      }
    },
    [activeStatus]
  );

  // --- xử lý state từ navigate (chỉ 1 lần)
  useEffect(() => {
    const tab = location.state?.tab;
    if (tab === "ADDING_PART") {
      setActiveStatus(TechnicianWorkingSessionEnum.ADDING_PART);
      fetchAppointments(TechnicianWorkingSessionEnum.ADDING_PART);
      // clear location.state sau khi xử lý
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleUpdateStatus = async (
    orderId: number,
    newStatus: TechnicianWorkingSessionEnum
  ) => {
    setAppointments((prev) =>
      prev.map((a) => (a.orderId === orderId ? { ...a, status: newStatus } : a))
    );
    setTimeout(async () => {
      await fetchAppointments();
      if (activeStatus !== newStatus) setActiveStatus(newStatus);
    }, 500);
  };

  const handlePartsUpdated = (orderId: number) => {
    setAppointments((prev) =>
      prev.map((a) => (a.orderId === orderId ? { ...a } : a))
    );
    fetchAppointments();
  };

  const sortName: TechnicianWorkingSessionEnum[] = [
    TechnicianWorkingSessionEnum.PENDING,
    TechnicianWorkingSessionEnum.ADDING_PART,
    TechnicianWorkingSessionEnum.CONFIRM,
    TechnicianWorkingSessionEnum.INPROGRESS,
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
        onChange={(val) => {
          setActiveStatus(val);
          fetchAppointments(val);
        }}
      />

      {isError ? (
        <ErrorMessage>Error loading technician appointments</ErrorMessage>
      ) : appointments.length === 0 ? (
        <Watermark>No appointments found</Watermark>
      ) : (
        <AppointmentList className={fade ? "fade-out" : ""}>
          {appointments.map((item) => (
            <AppointmentCard
              key={item.id}
              data={item}
              onStatusChange={handleUpdateStatus}
              onPartsUpdated={handlePartsUpdated}
            />
          ))}
        </AppointmentList>
      )}
    </AppointmentWrapper>
  );
}
