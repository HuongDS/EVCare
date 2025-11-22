import { useState, useEffect } from "react";
import { TechnicianWorkingSessionEnum } from "../models/enums/TechnicianWorkingSessionEnum";
import { useGetTechnicianAppointments } from "../services/appointmentTechnicianApi";
import { useUpdateTechnicianWorkingSession } from "../services/TechnicianWorkingSessionApi";
import { useQueryClient } from "@tanstack/react-query";
import { useNotification } from "../context/useNotification";

export const useTechnician_MyJob = () => {
  const notification = useNotification();
  const [sortById, setSortById] = useState<"asc" | "desc">("asc");
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const queryClient = useQueryClient();

  const [activeStatus, setActiveStatus] = useState<string>("AddingPart");

  const { data, isLoading, isFetching } = useGetTechnicianAppointments({
    Status: String(activeStatus),
    PageSize: pageSize,
    PageIndex: pageIndex,
    SortField: "orderId",
    SortOrder: "desc",
  });

  const { mutateAsync: updateWorkingSession, isPending: isUpdating } =
    useUpdateTechnicianWorkingSession();

  const handleUpdateStatus = async (
    status: TechnicianWorkingSessionEnum,
    message: string,
    description: string
  ) => {
    try {
      await updateWorkingSession({
        orderId: data?.data?.items?.at(0)?.orderId ?? 0,
        status: status,
      });
      await queryClient.invalidateQueries({
        queryKey: ["TechnicianAppointments"],
      });
      setActiveStatus(status);
      notification.success({
        message: message,
        description: description,
        showProgress: true,
      });
    } catch (err) {
      notification.error({
        message: message,
        description: (err as Error).message,
        showProgress: true,
      });
    }
  };

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
    appointments: data?.data?.items ?? [],
    isLoading: isLoading,
    isUpdating,
    isFetching,
    sortById,
    pageSize,
    setActiveStatus,
    setSortById,
    setPageSize,
    setPageIndex,
    handleUpdateStatus,
  };
};
