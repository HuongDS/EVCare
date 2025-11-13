import {
  PageWrapper,
  ContentWrapper,
  Header,
  Title,
  Instruction,
  FilterBar,
  AppointmentList,
} from "./Technician_MyJob.styled";
import SortTable from "../Technician_Component/SortTable";

import { useTechnician_MyJob } from "../../../hooks/useTechnician_MyJob";
import { AnimatePresence } from "framer-motion";
import SpinnerComponent from "../../../components/SpinnerComponent";
import TechnicianAppointmentCard from "../Technician_Component/TechnicianAppointmentCard";
import { EmptyState } from "../Technician_Component/EmptyState";
import { Pagination } from "../../../components/Paginations/Pagination";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  exit: { opacity: 0 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Technician_MyJob() {
  const {
    data,
    activeStatus,
    appointments,
    isLoading,
    setActiveStatus,
    setPageIndex,
  } = useTechnician_MyJob();
  const myJobStatuses = ["Adding Part", "Confirm", "In Progress", "Completed"];
  return (
    <PageWrapper key="technician-myjob" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
      <ContentWrapper>
        <Header>
          <Title variants={itemVariants}>My Jobs</Title>
          <Instruction variants={itemVariants}>
            Manage and update the status of appointments assigned to you.
          </Instruction>
        </Header>

        <FilterBar variants={itemVariants}>
          <SortTable
            sortName={myJobStatuses}
            active={activeStatus}
            onChange={(val) => {
              if (val !== activeStatus) {
                setActiveStatus(val.replace(/\s+/g, ""));
              }
            }}
          />
        </FilterBar>

        <AppointmentList layout transition={{ duration: 0.3 }}>
          <AnimatePresence>
            {isLoading ? (
              <SpinnerComponent />
            ) : appointments.length > 0 ? (
              appointments.map((item: any) => <TechnicianAppointmentCard key={item.id} data={item} />)
            ) : (
              <EmptyState />
            )}
          </AnimatePresence>
        </AppointmentList>

        <Pagination
          pageSize={data?.data?.pageSize || 10}
          pageIndex={data?.data?.pageIndex || 1}
          totalItems={data?.data?.totalItems || 0}
          totalPage={data?.data?.totalPages || 0}
          onPageChange={setPageIndex}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
