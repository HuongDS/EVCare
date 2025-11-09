import { useEffect, useState, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TechnicianWorkingSessionEnum } from "../models/enums/TechnicianWorkingSessionEnum";
import type { TechnicianAppointmentsDto } from "../models/AppointmentsModel/Technician_Appointments_Model";
import { useGetTechnicianAppointments } from "../services/appointmentTechnicianApi";
import { updateTechnicianWorkingSession } from "../services/TechnicianWorkingSessionApi";

// --- Debounce ---
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// --- Request queue for safe concurrent API calls ---
type Task<T> = () => Promise<T>;
class RequestQueue {
  private concurrency: number;
  private running = 0;
  private queue: Array<() => void> = [];

  constructor(concurrency: number) {
    this.concurrency = concurrency;
  }

  enqueue<T>(task: Task<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const runTask = () => {
        this.running++;
        task()
          .then(resolve)
          .catch(reject)
          .finally(() => {
            this.running--;
            if (this.queue.length > 0) {
              const next = this.queue.shift()!;
              next();
            }
          });
      };

      if (this.running < this.concurrency) {
        runTask();
      } else {
        this.queue.push(runTask);
      }
    });
  }
}
const requestQueue = new RequestQueue(3); // max 3 concurrent requests

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
  const [sortById, setSortById] = useState<"none" | "asc" | "desc">("none");

  // --- API QUERIES ---
  const { data, isLoading, isFetching, refetch } = useGetTechnicianAppointments(
    { Status: String(activeStatus), PageSize: 1000, PageIndex: 1 }
  );

  const { data: pendingData, isFetching: isPendingFetching } =
    useGetTechnicianAppointments({
      Status: "Pending",
      PageSize: 1000,
      PageIndex: 1,
    });

  const debouncedRefetch = useRef(debounce(() => refetch(), 500)).current;

  // --- Handle hidden pending order ---
  useEffect(() => {
    const handleHiddenPending = async () => {
      if (isPendingFetching) return;
      const pendingList = pendingData?.items ?? [];
      if (pendingList.length > 0) {
        const pending = pendingList[0];
        await requestQueue.enqueue(() =>
          updateTechnicianWorkingSession({
            orderId: pending.orderId,
            status: TechnicianWorkingSessionEnum.ADDING_PART,
          })
        );
        debouncedRefetch();
      }
    };
    handleHiddenPending();
  }, [pendingData, isPendingFetching, debouncedRefetch]);

  // --- Load appointments from API ---
  useEffect(() => {
    if (isFetching || isLoading) return;
    setFade(true);
    setIsError(false);
    setAppointments(data?.items ?? []);
    const timer = setTimeout(() => setFade(false), 80);
    return () => clearTimeout(timer);
  }, [data, isFetching, isLoading, activeStatus]);

  // --- Tab navigation fix ---
  useEffect(() => {
    const tab = (location.state as { tab: TechnicianWorkingSessionEnum })?.tab;
    if (tab && tab === TechnicianWorkingSessionEnum.ADDING_PART) {
      setActiveStatus(TechnicianWorkingSessionEnum.ADDING_PART);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  // --- HANDLERS ---
  const handleUpdateStatus = (
    appointmentId: number,
    newStatus: TechnicianWorkingSessionEnum
  ) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId ? { ...a, status: newStatus } : a
      )
    );

    requestQueue.enqueue(() => refetch()); // limit concurrent API call
  };

  const handlePartsUpdated = (appointmentId: number) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a } : a))
    );
    debouncedRefetch();
  };

  const handleSortById = debounce(() => {
    setSortById((prev) =>
      prev === "none" ? "asc" : prev === "asc" ? "desc" : "asc"
    );
  }, 150);

  const sortedAppointments = useMemo(() => {
    if (
      (activeStatus === TechnicianWorkingSessionEnum.COMPLETED ||
        activeStatus === TechnicianWorkingSessionEnum.CANCELED) &&
      sortById !== "none"
    ) {
      return [...appointments].sort((a, b) =>
        sortById === "asc" ? a.id - b.id : b.id - a.id
      );
    }
    return appointments;
  }, [appointments, sortById, activeStatus]);

  const sortName: TechnicianWorkingSessionEnum[] = [
    TechnicianWorkingSessionEnum.ADDING_PART,
    TechnicianWorkingSessionEnum.CONFIRM,
    TechnicianWorkingSessionEnum.INPROGRESS,
    TechnicianWorkingSessionEnum.COMPLETED,
    TechnicianWorkingSessionEnum.CANCELED,
  ];

  return {
    activeStatus,
    sortName,
    appointments: sortedAppointments,
    isError,
    fade,
    isLoading: isLoading || isFetching,
    isFetching,
    sortById,
    handleSortById,
    setActiveStatus,
    handleUpdateStatus,
    handlePartsUpdated,
  };
};
