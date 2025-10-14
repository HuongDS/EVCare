import { useEffect, useState, useMemo } from "react";
import AppointmentCard from "../Technician_Component/AppointmentCard";
import SearchBar from "../Technician_Component/SearchBar";
import LoadingOverlay from "../Technician_Component/LoadingOverlay";
import { getTechnicianAppointments } from "../../../services/appointmentTechnicianApi";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import {
  AppointmentWrapper,
  TitleWrapper,
  Title,
  PaginationWrapper,
  ControlsWrapper,
  Watermark,
  AppointmentList,
} from "./Technician_History.styled";
import { Pagination } from "../../../components/Paginations/Pagination";

import { LENGTH } from "../../../constants/Code/Constants";
import SortTable from "../Technician_Component/SortTable";

const PAGE_SIZE = LENGTH.VIEW_HISTORY_MAX;

export default function TechnicianHistory() {
  const [appointments, setAppointments] = useState<TechnicianAppointmentsDto[]>(
    []
  );
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Completed" | "Cancelled"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAppointments = async (
    status?: "Completed" | "Cancelled" | "All"
  ) => {
    setLoading(true);
    try {
      let allItems: TechnicianAppointmentsDto[] = [];

      if (status === "All") {
        const completed = await getTechnicianAppointments({
          PageSize: 50,
          PageIndex: 1,
          Status: "Completed",
        });
        const cancelled = await getTechnicianAppointments({
          PageSize: 50,
          PageIndex: 1,
          Status: "Cancelled",
        });
        allItems = [...(completed.items ?? []), ...(cancelled.items ?? [])];
      } else {
        const data = await getTechnicianAppointments({
          PageSize: 50,
          PageIndex: 1,
          Status: status,
        });
        allItems = data.items ?? [];
      }

      setAppointments(allItems);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(statusFilter);
  }, [statusFilter]);

  const filteredAppointments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (query === "") return appointments;

    const words = query.split(/\s+/);

    return appointments.filter((a) => {
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
  }, [appointments, searchQuery]);

  const totalPages = Math.ceil(filteredAppointments.length / PAGE_SIZE);
  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAppointments.slice(start, start + PAGE_SIZE);
  }, [filteredAppointments, currentPage]);

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
          sortName={["All", "Completed", "Cancelled"]}
          active={statusFilter}
          onChange={(val) =>
            setStatusFilter(val as "All" | "Completed" | "Cancelled")
          }
        />
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
