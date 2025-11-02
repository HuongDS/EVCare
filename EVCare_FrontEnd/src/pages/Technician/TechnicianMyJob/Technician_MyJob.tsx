import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SortTable from "../Technician_Component/SortTable";
import {
  AppointmentWrapper,
  TitleWrapper,
  Title,
} from "./Technician_MyJob.styled";

import { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { getTechnicianAppointments } from "../../../services/appointmentTechnicianApi";
import { updateTechnicianWorkingSession } from "../../../services/TechnicianWorkingSessionApi";
import { CardListSection } from "../Technician_Component/CardListSection";

export default function Technician_MyJob() {
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

  const fetchAppointments = useCallback(
    async (statusOverride?: TechnicianWorkingSessionEnum) => {
      const statusToFetch = statusOverride ?? activeStatus;
      setIsLoading(true);
      setIsError(false);
      setFade(true);

      try {
        // 🔹 Gọi API lấy danh sách appointment theo trạng thái
        const data = await getTechnicianAppointments({
          Status: statusToFetch,
          PageSize: 1000,
          PageIndex: 1,
        });

        const list = data.items ?? [];

        // ✅ Nếu đang ở tab PENDING mà có 1 appointment, auto đổi sang ADDING_PART
        if (
          statusToFetch === TechnicianWorkingSessionEnum.PENDING &&
          list.length > 0
        ) {
          const pendingAppointment = list[0]; // chỉ lấy 1 cái duy nhất
          await updateTechnicianWorkingSession({
            orderId: pendingAppointment.orderId,
            status: TechnicianWorkingSessionEnum.ADDING_PART,
          });

          console.log("✅ Appointment moved to ADDING_PART");

          setActiveStatus(TechnicianWorkingSessionEnum.ADDING_PART);
          await fetchAppointments(TechnicianWorkingSessionEnum.ADDING_PART);
          return;
        }

        setAppointments(list);
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

  useEffect(() => {
    const tab = location.state?.tab;
    if (tab === "ADDING_PART") {
      setActiveStatus(TechnicianWorkingSessionEnum.ADDING_PART);
      fetchAppointments(TechnicianWorkingSessionEnum.ADDING_PART);
      navigate(location.pathname, { replace: true, state: {} });
    }
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
    TechnicianWorkingSessionEnum.ADDING_PART,
    TechnicianWorkingSessionEnum.CONFIRM,
    TechnicianWorkingSessionEnum.INPROGRESS,
    TechnicianWorkingSessionEnum.COMPLETED,
    TechnicianWorkingSessionEnum.CANCELED,
  ];

  return (
    <AppointmentWrapper>
      <TitleWrapper>
        <Title>Technician Jobs</Title>
      </TitleWrapper>

      <SortTable
        sortName={sortName}
        active={activeStatus}
        onChange={(val) => {
          if (val !== activeStatus) {
            setActiveStatus(val);
            fetchAppointments(val);
          }
        }}
      />

      <CardListSection
        isError={isError}
        fade={fade}
        appointments={appointments}
        onStatusChange={handleUpdateStatus}
        onPartsUpdated={handlePartsUpdated}
        isLoading={isLoading}
      />
    </AppointmentWrapper>
  );
}
