import { useEffect, useState, useMemo } from "react";
import AppointmentCard from "../Technician_Component/AppointmentCard";
import SearchBar from "../Technician_Component/SearchBar";
import LoadingOverlay from "../Technician_Component/LoadingOverlay";
import { useGetTechnicianAppointments } from "../../../services/appointmentTechnicianApi";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import {
  AppointmentWrapper,
  TitleWrapper,
  Title,
  PaginationWrapper,
  ControlsWrapper,
  Watermark,
  AppointmentList,
  SortWrapper,
  SortButton,
} from "./Technician_History.styled";
import { Pagination } from "../../../components/Paginations/Pagination";
import { LENGTH } from "../../../constants/Code/Constants";
import SortTable from "../Technician_Component/SortTable";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";

const PAGE_SIZE = LENGTH.VIEW_HISTORY_MAX;

export default function TechnicianHistory() {
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Completed" | "Canceled"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointments, setAppointments] = useState<TechnicianAppointmentsDto[]>(
    []
  );
  const [sortById, setSortById] = useState<"none" | "asc" | "desc">("none");

  const { data: completedData } = useGetTechnicianAppointments({
    Status: "Completed",
    PageSize: 50,
    PageIndex: 1,
  });
  const { data: canceledData } = useGetTechnicianAppointments({
    Status: "Canceled",
    PageSize: 50,
    PageIndex: 1,
  });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        if (statusFilter === "All") {
          const completed = completedData?.items ?? [];
          const canceled = canceledData?.items ?? [];
          setAppointments([...completed, ...canceled]);
        } else if (statusFilter === "Completed") {
          setAppointments(completedData?.items ?? []);
        } else {
          setAppointments(canceledData?.items ?? []);
        }
        setCurrentPage(1);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [statusFilter, completedData, canceledData]);

  const filteredAppointments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let list = appointments;

    if (query !== "") {
      const words = query.split(/\s+/);
      list = list.filter((a) => {
        const text = (
          a.customerName +
          " " +
          a.vehicleModel +
          " " +
          a.licensePlate +
          " " +
          a.id
        ).toLowerCase();
        return words.every((word) => text.includes(word));
      });
    }

    // Sort by appointment.id
    if (sortById !== "none") {
      list = [...list].sort((a, b) =>
        sortById === "asc" ? a.id - b.id : b.id - a.id
      );
    }

    return list;
  }, [appointments, searchQuery, sortById]);

  const totalPages = Math.ceil(filteredAppointments.length / PAGE_SIZE);
  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAppointments.slice(start, start + PAGE_SIZE);
  }, [filteredAppointments, currentPage]);

  const toggleSortById = () => {
    setSortById((prev) =>
      prev === "none" ? "asc" : prev === "asc" ? "desc" : "none"
    );
  };

  return (
    <AppointmentWrapper>
      {loading && <LoadingOverlay />}

      <TitleWrapper>
        <Title>Technician History</Title>
      </TitleWrapper>

      <ControlsWrapper>
        <SearchBar
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search"
        />

        <SortTable
          sortName={["All", "Completed", "Canceled"]}
          active={statusFilter}
          onChange={(val) =>
            setStatusFilter(val as "All" | "Completed" | "Canceled")
          }
        />

        {(statusFilter === "Completed" ||
          statusFilter === "Canceled" ||
          statusFilter === "All") && (
          <SortWrapper>
            <SortButton onClick={toggleSortById}>
              {sortById === "none" && "Sort by ID"}
              {sortById === "asc" && (
                <>
                  <ArrowDownWideNarrow size={16} /> ID
                </>
              )}
              {sortById === "desc" && (
                <>
                  <ArrowUpNarrowWide size={16} /> ID
                </>
              )}
            </SortButton>
          </SortWrapper>
        )}
      </ControlsWrapper>

      <AppointmentList>
        {paginatedAppointments.length > 0 ? (
          paginatedAppointments.map((item) => (
            <AppointmentCard key={item.id} data={item} />
          ))
        ) : !loading ? (
          <Watermark>No appointments found</Watermark>
        ) : null}
      </AppointmentList>

      {totalPages > 1 && (
        <PaginationWrapper style={{ marginTop: "auto" }}>
          <Pagination
            pageIndex={currentPage}
            totalPage={totalPages}
            totalItems={filteredAppointments.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </PaginationWrapper>
      )}
    </AppointmentWrapper>
  );
}
