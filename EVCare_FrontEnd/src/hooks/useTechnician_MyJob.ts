import { useState, useMemo, useEffect } from "react";
import { TechnicianWorkingSessionEnum } from "../models/enums/TechnicianWorkingSessionEnum";
import { useGetTechnicianAppointments } from "../services/appointmentTechnicianApi";
import { useUpdateTechnicianWorkingSession } from "../services/TechnicianWorkingSessionApi";
import { useQueryClient } from "@tanstack/react-query";
import { useNotification } from "../context/useNotification";

export const useTechnician_MyJob = () => {
  const notification = useNotification();
  const [sortById, setSortById] = useState<"asc" | "desc">("asc");
  const [pageSize, setPageSize] = useState<number>(1);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const queryClient = useQueryClient();

  const savedStatus =
    sessionStorage.getItem("activeStatus") ||
    TechnicianWorkingSessionEnum.ADDING_PART;
  const [activeStatus, setActiveStatus] = useState<string>(savedStatus);
  useEffect(() => {
    sessionStorage.setItem("activeStatus", activeStatus);
  }, [activeStatus]);

  const { data, isLoading, isFetching } = useGetTechnicianAppointments({
    Status: String(activeStatus),
    PageSize: pageSize,
    PageIndex: pageIndex,
  });

  const { mutateAsync: updateWorkingSession } =
    useUpdateTechnicianWorkingSession();

  const handleUpdateStatus = async (
    orderId: number,
    status: TechnicianWorkingSessionEnum
  ) => {
    try {
      await updateWorkingSession({ orderId: orderId, status: status });
      queryClient.invalidateQueries({ queryKey: ["TechnicianAppointments"] });
      notification.success({
        message: "Update Working Session",
        description: "Success",
        showProgress: true,
      });
    } catch (error) {
      notification.error({
        message: "Update Working Session",
        description: (error as Error).message,
        showProgress: true,
      });
    }
  };

  const appointments = useMemo(() => {
    const sourceData = data?.data?.items ?? [];

    if (
      activeStatus === TechnicianWorkingSessionEnum.COMPLETED ||
      activeStatus === TechnicianWorkingSessionEnum.CANCELED
    ) {
      return [...sourceData].sort((a, b) =>
        sortById === "asc" ? a.id - b.id : b.id - a.id
      );
    }
    return sourceData;
  }, [data?.data?.items, sortById, activeStatus]);

  const sortName: TechnicianWorkingSessionEnum[] = [
    TechnicianWorkingSessionEnum.ADDING_PART,
    TechnicianWorkingSessionEnum.CONFIRM,
    TechnicianWorkingSessionEnum.INPROGRESS,
    TechnicianWorkingSessionEnum.COMPLETED,
    TechnicianWorkingSessionEnum.CANCELED,
  ];

  return {
    data,
    activeStatus,
    sortName,
    appointments,
    isLoading: isLoading || isFetching,
    isFetching,
    sortById,
    setActiveStatus,
    handleUpdateStatus,
  };
};
