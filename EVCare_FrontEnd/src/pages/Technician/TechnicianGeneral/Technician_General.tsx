import { useEffect, useState, useCallback } from "react";
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
      console.error("❌ Failed to fetch appointments", e);
      setIsError(true);
    } finally {
      setTimeout(() => setFade(false), 80);
      setIsLoading(false);
    }
  }, [activeStatus]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  /* Update status của appointment cụ thể */
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

  /* Callback khi thêm part cho appointment cụ thể */
  const handlePartsUpdated = (orderId: number) => {
    setAppointments((prev) =>
      prev.map(
        (a) => (a.orderId === orderId ? { ...a } : a) // reload appointment nếu cần
      )
    );
    fetchAppointments(); // tùy chọn: reload dữ liệu từ backend
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
        <ErrorMessage>⚠️ Error loading technician appointments</ErrorMessage>
      ) : appointments.length === 0 ? (
        <Watermark>No appointments found</Watermark>
      ) : (
        <AppointmentList className={fade ? "fade-out" : ""}>
          {appointments.map((item) => (
            <AppointmentCard
              key={item.id}
              data={item}
              onStatusChange={handleUpdateStatus}
              onPartsUpdated={handlePartsUpdated} // 🔹 chỉ cập nhật appointment hiện tại
            />
          ))}
        </AppointmentList>
      )}
    </AppointmentWrapper>
  );
}
