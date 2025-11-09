import SortTable from "../Technician_Component/SortTable";
import {
  AppointmentWrapper,
  TitleWrapper,
  Title,
  SortWrapper,
  SortButton,
} from "./Technician_MyJob.styled";
import { CardListSection } from "../Technician_Component/CardListSection";

import { useTechnician_MyJob } from "../../../hooks/useTechnician_MyJob";
import { TechnicianWorkingSessionEnum } from "../../../models/enums";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";

export default function Technician_MyJob() {
  const {
    activeStatus,
    sortName,
    appointments,
    isError,
    fade,
    isLoading,
    isFetching,
    sortById,
    handleSortById,

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

      {(activeStatus === TechnicianWorkingSessionEnum.COMPLETED ||
        activeStatus === TechnicianWorkingSessionEnum.CANCELED) && (
        <SortWrapper>
          <SortButton onClick={handleSortById}>
            {sortById === "none" && "Sort by ID"}
            {sortById === "asc" && (
              <>
                <ArrowUpNarrowWide size={16} /> ID
              </>
            )}
            {sortById === "desc" && (
              <>
                <ArrowDownWideNarrow size={16} /> ID
              </>
            )}
          </SortButton>
        </SortWrapper>
      )}

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
