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
import { useState } from "react";
import TechnicianOrder from "../TechnicianOrder/Technician_Order";
import { useTechnicianHubNewJob } from "../../../hooks/useTechnicianHub";
import { useNotification } from "../../../context/useNotification";
import ViewDetailsModal from "../Technician_Component/ViewDetailsModal";
import Technician_Repairing from "./Technician_Repairing";

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
    isUpdating,
    setActiveStatus,
    setPageIndex,
    handleUpdateStatus,
    isFetching,
  } = useTechnician_MyJob();
  const myJobStatuses = ["Adding Part", "Confirm", "In Progress", "Completed"];
  const [isOrder, setIsOrder] = useState(false);
  const notification = useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);

  useTechnicianHubNewJob<string>(async (type, data) => {
    if (type === "NewJob" && data === "You was assigned new job.") {
      notification.success({
        message: "New Job",
        description: data,
        showProgress: true,
      });
    }
  });

  if (isOrder) {
    return (
      <TechnicianOrder
        appointmentId={data?.data?.items?.at(0)?.id ?? 0}
        setIsOrder={setIsOrder}
        orderId={data?.data?.items?.at(0)?.orderId ?? 0}
      />
    );
  }

  if (isRepairing && data?.data?.items?.at(0)) {
    return (
      <Technician_Repairing
        appointment={data?.data?.items?.at(0)!}
        setIsRepairing={setIsRepairing}
        orderId={data?.data?.items?.at(0)?.orderId ?? 0}
      />
    );
  }
  return (
    <PageWrapper
      key="technician-myjob"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
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
            {isLoading && isFetching ? (
              <SpinnerComponent />
            ) : appointments.length > 0 ? (
              appointments.map((item: any) => (
                <TechnicianAppointmentCard
                  isUpdating={isUpdating}
                  handleUpdateStatus={handleUpdateStatus}
                  setIsOrder={setIsOrder}
                  key={item.id}
                  data={item}
                  setViewDetailModal={setIsModalOpen}
                  setIsRepairing={setIsRepairing}
                />
              ))
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

      {isModalOpen && (
        <ViewDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          appointment={data?.data?.items?.at(0) ?? null}
        />
      )}
    </PageWrapper>
  );
}
