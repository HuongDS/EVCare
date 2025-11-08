import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TechnicianWorkingSessionEnum } from "../models/enums/TechnicianWorkingSessionEnum";
import type { TechnicianAppointmentsDto } from "../models/AppointmentsModel/Technician_Appointments_Model";
import { useGetTechnicianAppointments } from "../services/appointmentTechnicianApi";
import { updateTechnicianWorkingSession } from "../services/TechnicianWorkingSessionApi";

export const useTechnician_MyJob = () => {
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

  // --- API QUERIES ---
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

  // --- EFFECTS ---

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
  }, [pendingData, isPendingFetching, refetch]);

  useEffect(() => {
    if (isFetching || isLoading) return;
    setFade(true);
    setIsError(false);

    const list = data?.items ?? [];
    setAppointments(list);

    const timer = setTimeout(() => setFade(false), 80);
    return () => clearTimeout(timer);
  }, [data, isFetching, isLoading, activeStatus]);

  useEffect(() => {
    const tab = (location.state as { tab: TechnicianWorkingSessionEnum })?.tab;
    if (tab && tab === TechnicianWorkingSessionEnum.ADDING_PART) {
      setActiveStatus(TechnicianWorkingSessionEnum.ADDING_PART);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  // --- HANDLERS ---

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
    refetch(); // Fetch lại dữ liệu mới nhất
  };

  const sortName: TechnicianWorkingSessionEnum[] = [
    TechnicianWorkingSessionEnum.ADDING_PART,
    TechnicianWorkingSessionEnum.CONFIRM,
    TechnicianWorkingSessionEnum.INPROGRESS,
    TechnicianWorkingSessionEnum.COMPLETED,
    TechnicianWorkingSessionEnum.CANCELED,
  ];

  // --- RETURN OBJECT ---
  return {
    activeStatus,
    sortName,
    appointments,
    isError,
    fade,
    isLoading: isLoading || isFetching,
    isFetching,

    setActiveStatus,
    handleUpdateStatus,
    handlePartsUpdated,
  };
};
