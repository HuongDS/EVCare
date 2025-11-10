import { useState } from "react";
import { useGetTechnicianAppointments } from "../../../services/appointmentTechnicianApi";
import {
  PageWrapper,
  Title,
  Header,
  Instruction,
  ContentWrapper,
  FilterBar,
  StatusFilterTabs,
  TabButton,
  SortButton,
  AppointmentList,
  PaginationWrapper,
} from "./Technician_History.styled";
import { Pagination } from "../../../components/Paginations/Pagination";
import { LENGTH } from "../../../constants/Code/Constants";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import SpinnerComponent from "../../../components/SpinnerComponent";
import TechnicianAppointmentCard from "../Technician_Component/TechnicianAppointmentCard";
import { EmptyState } from "../Technician_Component/EmptyState";

const PAGE_SIZE = LENGTH.VIEW_HISTORY_MAX || 10;

export default function TechnicianHistory() {
  const [statusFilter, setStatusFilter] = useState<"Completed" | "Canceled">("Completed");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortById, setSortById] = useState<"asc" | "desc">("desc");

  const { data, isLoading } = useGetTechnicianAppointments({
    Status: statusFilter,
    PageIndex: currentPage,
    PageSize: PAGE_SIZE,
    SortField: "OrderId",
    SortOrder: sortById,
  });

  const appointments = data?.items ?? [];
  const totalItems = data?.totalItems ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const toggleSortById = () => {
    setSortById((prev) => (prev === "desc" ? "asc" : "desc"));
    setCurrentPage(1);
  };

  return (
    <PageWrapper key="technician-history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <ContentWrapper>
        <Header>
          <Title>History Jobs</Title>
          <Instruction>Review completed or canceled appointments assigned to you.</Instruction>
        </Header>

        <FilterBar>
          <StatusFilterTabs>
            <TabButton $isActive={statusFilter === "Completed"} onClick={() => setStatusFilter("Completed")}>
              Completed
            </TabButton>
            <TabButton $isActive={statusFilter === "Canceled"} onClick={() => setStatusFilter("Canceled")}>
              Canceled
            </TabButton>
          </StatusFilterTabs>

          <SortButton onClick={toggleSortById} style={{ marginLeft: "auto" }}>
            {sortById === "asc" && (
              <>
                <ArrowUpNarrowWide size={16} /> ID Asc
              </>
            )}

            {sortById === "desc" && (
              <>
                <ArrowDownWideNarrow size={16} /> ID Desc
              </>
            )}
          </SortButton>
        </FilterBar>

        <AppointmentList layout transition={{ duration: 0.3 }}>
          <AnimatePresence>
            {isLoading ? (
              <SpinnerComponent />
            ) : appointments.length > 0 ? (
              appointments.map((item) => <TechnicianAppointmentCard key={item.id} data={item} />)
            ) : (
              <EmptyState />
            )}
          </AnimatePresence>
        </AppointmentList>

        {totalPages > 1 && !isLoading && (
          <PaginationWrapper>
            <Pagination
              pageIndex={currentPage}
              totalPage={totalPages}
              totalItems={totalItems}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </PaginationWrapper>
        )}
      </ContentWrapper>
    </PageWrapper>
  );
}
