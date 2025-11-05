import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SortTable from "../Technician_Component/SortTable";
import {
  AppointmentWrapper,
  TitleWrapper,
  Title,
} from "./Technician_MyJob.styled";

import { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { useGetTechnicianAppointments } from "../../../services/appointmentTechnicianApi";
import { updateTechnicianWorkingSession } from "../../../services/TechnicianWorkingSessionApi";
import { CardListSection } from "../Technician_Component/CardListSection";

export default function Technician_MyJob() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeStatus, setActiveStatus] =
    useState<TechnicianWorkingSessionEnum>(
      TechnicianWorkingSessionEnum.ADDING_PART
    );

  const [appointments, setAppointments] = useState<TechnicianAppointmentsDto[]>(
    []
  );
  const [isError, setIsError] = useState(false);
  const [fade, setFade] = useState(false);

  const { data, isLoading, isFetching, refetch } = useGetTechnicianAppointments(
    {
      Status: String(activeStatus),
      PageSize: 1000,
      PageIndex: 1,
    }
  );
  const { data: pendingData, isFetching: isPendingFetching } =
    useGetTechnicianAppointments({
      Status: "Pending",
      PageSize: 1000,
      PageIndex: 1,
    });

  useEffect(() => {
    const handleHiddenPending = async () => {
      if (isPendingFetching) return;

      const pendingList = pendingData?.items ?? [];
      if (pendingList.length > 0) {
        const pending = pendingList[0];

        const updateRes = await updateTechnicianWorkingSession({
          orderId: pending.orderId,
          status: TechnicianWorkingSessionEnum.ADDING_PART,
        });

        if (updateRes) {
          await refetch();
        }
      }
    };

    handleHiddenPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingData, isPendingFetching]);

  useEffect(() => {
    if (isFetching || isLoading) return;

    setFade(true);
    setIsError(false);

    const list = data?.items ?? [];
    setAppointments(list);

    setTimeout(() => setFade(false), 80);
  }, [data, isFetching, isLoading, activeStatus]);

  useEffect(() => {
    const tab = location.state?.tab;
    if (tab === "ADDING_PART") {
      setActiveStatus(TechnicianWorkingSessionEnum.ADDING_PART);
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  const handleUpdateStatus = async (
    orderId: number,
    newStatus: TechnicianWorkingSessionEnum
  ) => {
    setAppointments((prev) =>
      prev.map((a) => (a.orderId === orderId ? { ...a, status: newStatus } : a))
    );

    setTimeout(async () => {
      await refetch();
      if (activeStatus !== newStatus) setActiveStatus(newStatus);
    }, 500);
  };

  const handlePartsUpdated = (orderId: number) => {
    setAppointments((prev) =>
      prev.map((a) => (a.orderId === orderId ? { ...a } : a))
    );
    refetch();
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
          }
        }}
      />

      <CardListSection
        isError={isError}
        fade={fade}
        appointments={appointments}
        onStatusChange={handleUpdateStatus}
        onPartsUpdated={handlePartsUpdated}
        isLoading={isLoading || isFetching}
      />
    </AppointmentWrapper>
  );
}
