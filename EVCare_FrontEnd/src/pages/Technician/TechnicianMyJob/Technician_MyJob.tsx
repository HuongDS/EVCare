// src/pages/Technician/TechnicianMyJob/Technician_MyJob.tsx

import SortTable from "../Technician_Component/SortTable";
import {
  AppointmentWrapper,
  TitleWrapper,
  Title,
} from "./Technician_MyJob.styled";
import { CardListSection } from "../Technician_Component/CardListSection";

import { useTechnician_MyJob } from "../../../hooks/useTechnician_MyJob";

export default function Technician_MyJob() {
  const {
    activeStatus,
    sortName,
    appointments,
    isError,
    fade,
    isLoading,
    isFetching,

    setActiveStatus,
    handleUpdateStatus,
    handlePartsUpdated,
  } = useTechnician_MyJob();
  const combinedLoading = isLoading || isFetching;
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
        isLoading={combinedLoading}
      />
    </AppointmentWrapper>
  );
}
