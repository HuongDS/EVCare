import { Tooltip } from "antd";
import type {
  TechnicianModel,
  TechnicianSkills,
} from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import {
  useAssignTechnician,
  useGetAppointmentById,
  useGetPendingParts,
  useGetTechniciansToday,
  useReassignTechForPart,
} from "../../../services/appointmentServiceApi";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  CircleX,
  Mail,
  Phone,
  Search,
  User,
  AlertTriangle,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import SuccessModal from "../../../components/StatusModal/SuccessModal";
import FailedModal from "../../../components/StatusModal/FailModal";
import { handleError } from "../../../utils/errorHandler";
import ErrorPage from "../StaffComponents/Error";
import ColorSpinner from "../StaffComponents/ColorSpinner";
import { PiWarning } from "react-icons/pi";
import { useFinishTechnicianSession } from "../../../services/TechnicianWorkingSessionApi";
import { useNotification } from "../../../context/useNotification";
import PartReassignmentModal from "./PartReassignmentModal";
import type { PartPendingUpdate } from "../../../models/OrderModel/UpdateOrderModel";

interface props {
  close: () => void;
  appointmentId: number;
}

interface AssignedTechnician {
  technicianID: number;
  technician: TechnicianModel<TechnicianSkills>;
  startedTime: string;
}

export default function Appointment_Reassign({ close, appointmentId }: props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechnicians, setSelectedTechnicians] = useState<
    AssignedTechnician[]
  >([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isPartModalOpen, setIsPartModalOpen] = useState(false);
  const [selectedTechnicianForParts, setSelectedTechnicianForParts] =
    useState<TechnicianModel<TechnicianSkills> | null>(null);
  const notification = useNotification();

  const {
    data: appointmentDetail,
    isLoading,
    error,
    refetch,
  } = useGetAppointmentById(appointmentId);
  const { mutateAsync: reAssign, isPending: techReassigning } =
    useAssignTechnician();
  const { mutateAsync: reassignParts, isPending: partReassigning } =
    useReassignTechForPart();
  const { data: technicians, isFetching } = useGetTechniciansToday({
    Status: "Available",
  });
  const { mutateAsync: finishSession, isPending: finishing } =
    useFinishTechnicianSession();

  const { data: pendingPart } = useGetPendingParts({
    orderId: appointmentDetail?.data?.orderId || 0,
    technicianIds:
      appointmentDetail?.data?.technicians
        .filter((tech) => tech.status === "OnLeave")
        .map((tech) => tech.id) || [],
  });

  if (isLoading) {
    return (
      <ContentWrapper>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
          }}
        >
          <ColorSpinner width="6em" height="6em" />
        </div>
      </ContentWrapper>
    );
  }

  if (error) {
    notification.error({
      message: "Appointment",
      description: error?.message || "Failed to load appointment details",
      showProgress: true,
    });
    return (
      <ContentWrapper>
        <ErrorPage onGoHome={close} onRetry={refetch} />
      </ContentWrapper>
    );
  }

  if (!appointmentDetail?.data) {
    return (
      <ContentWrapper>
        <ErrorPage onGoHome={close} onRetry={refetch} />
      </ContentWrapper>
    );
  }

  const appointment = appointmentDetail.data;

  const assignedTechnicianIDs = [
    ...selectedTechnicians.map((st) => st.technicianID),
  ];

  const filteredTechnicians =
    technicians?.data?.items
      ?.flat()
      .filter(
        (tech) =>
          tech.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !assignedTechnicianIDs.includes(tech.id)
      ) || [];

  const handleAddTechnician = async (
    technician: TechnicianModel<TechnicianSkills>
  ) => {
    const newAssignment: AssignedTechnician = {
      technicianID: technician.id,
      technician,
      startedTime: new Date().toISOString(),
    };
    setSelectedTechnicians([...selectedTechnicians, newAssignment]);
    setSearchQuery("");
  };

  const handleRemoveTechnician = (technicianID: number) => {
    setSelectedTechnicians(
      selectedTechnicians.filter((st) => st.technicianID !== technicianID)
    );
  };

  const queryClient = useQueryClient();
  const handleReAssign = async () => {
    const checkStatusForTechnicianAssign = (): "AddingPart" | "InProgress" => {
      if (appointment.status === "AddingPart") {
        return "AddingPart";
      } else {
        return "InProgress";
      }
    };
    try {
      await reAssign({
        orderId: appointment.orderId,
        technicianIds: assignedTechnicianIDs,
        status: checkStatusForTechnicianAssign(),
      });
      await queryClient.invalidateQueries({ queryKey: ["AppointmentDetail"] });
      setSelectedTechnicians([]);
      setIsSuccessModalOpen(true);
      setModalMessage("ReAssign Technicians successfully");
    } catch (error) {
      handleError(error);
      setIsErrorModalOpen(true);
      setModalMessage(
        (error as Error).message || "ReAssign Technicians failed! Try again"
      );
    }
  };

  const handleCloseModal = () => {
    setIsErrorModalOpen(false);
    setIsSuccessModalOpen(false);
    close();
  };

  const checkAndFinishSession = async (
    technician?: TechnicianModel<TechnicianSkills>
  ) => {
    const isHasPartPending = pendingPart?.data?.find(
      (part) => part.technicianId === technician?.id
    );

    if (isHasPartPending) {
      setSelectedTechnicianForParts(technician!);
      setIsPartModalOpen(true);
    } else {
      await handleFinishSession([technician?.id || 0]);
    }
  };

  const handleFinishSession = async (techniciansLeave: number[]) => {
    try {
      await finishSession({
        technicianId: techniciansLeave,
        orderId: appointment.orderId,
      });
      notification.success({
        message: "Finish Session",
        description: "Technician's session is finished successfully",
        showProgress: true,
      });
      await refetch();
    } catch (error) {
      notification.error({
        message: "Finish Session Failed",
        description:
          (error as Error).message ||
          "Failed to finish session of this technician",
        showProgress: true,
      });
    }
  };

  const handlePartReassignmentConfirm = async (
    reassignments: PartPendingUpdate[]
  ) => {
    try {
      await reassignParts({
        orderId: appointment.orderId,
        updateParts: reassignments,
      });

      notification.success({
        message: "Parts Reassigned",
        description: "Parts have been successfully reassigned",
        showProgress: true,
      });

      if (selectedTechnicianForParts) {
        await handleFinishSession([selectedTechnicianForParts.id]);
      }
      setIsPartModalOpen(false);
      setSelectedTechnicianForParts(null);
    } catch (error) {
      notification.error({
        message: "Part Reassignment Failed",
        description: (error as Error).message || "Failed to reassign parts",
        showProgress: true,
      });
      throw error;
    }
  };

  const activeTechs = appointment.technicians.filter(
    (tech) => tech.workingSessionStatus !== "Completed"
  );
  // const onLeave = activeTechs.filter((tech) => tech.status === "OnLeave");
  // const busy = activeTechs.filter((tech) => tech.status === "Busy");
  const techniciansLeave = activeTechs
    .filter((tech) => tech.status === "OnLeave")
    .map((tech) => tech.id);

  // const showFinish =
  //   onLeave.length > 0 &&
  //   (busy.length > 0 || onLeave.length < activeTechs.length);

  const handleSubmit = async () => {
    if (techniciansLeave.length > 0) {
      const techsWithIncompleteParts = techniciansLeave.filter((techId) =>
        pendingPart?.data?.some((t) => t.technicianId === techId)
      );

      if (techsWithIncompleteParts.length > 0) {
        notification.warning({
          message: "Incomplete Parts Detected",
          description:
            "Some technicians have unfinished parts. Please reassign them manually.",
          showProgress: true,
        });
      } else {
        await handleReAssign();
        await handleFinishSession(techniciansLeave);
      }
    }

    const busy = activeTechs.filter((tech) => tech.status === "Busy");
    if (busy.length === 0) {
      close();
    }
  };

  const getTechnicianCountForService = (serviceId: number) => {
    return (
      selectedTechnicians.filter((tech) =>
        tech.technician.skills.some((skill) => skill.id === serviceId)
      ).length +
      appointment.technicians
        .filter((tech) => tech.workingSessionStatus !== "Completed")
        .filter((tech) => tech.skills.some((skill) => skill.id === serviceId))
        .length
    );
  };

  const technicianHasParts = (technicianId: number): boolean => {
    return (
      pendingPart?.data?.some((t) => t.technicianId === technicianId) || false
    );
  };

  return (
    <>
      <PageContainer>
        <ContentWrapper>
          <BackButton onClick={close}>
            <ArrowLeft size={20} />
            Back
          </BackButton>
          <Card>
            <Header>
              <h1>Re-Assign Technicians</h1>
              <p>Manage technicians for appointment #{appointment.id}</p>
            </Header>
          </Card>

          {appointment.technicians.length > 0 && (
            <Card>
              <SectionHeader>
                <h2>
                  Currently Assigned (
                  {
                    appointment.technicians.filter(
                      (tech) => tech.workingSessionStatus !== "Completed"
                    ).length
                  }
                  )
                </h2>
              </SectionHeader>

              <TechnicianGrid>
                {appointment.technicians
                  .filter((tech) => tech.workingSessionStatus !== "Completed")
                  .map((assignment) => (
                    <TechnicianCard
                      key={assignment.id}
                      technician={assignment}
                      isPreviouslyAssigned
                      onFinishSession={() => checkAndFinishSession(assignment)}
                      showFinish={assignment.status === "OnLeave"}
                      isFinishing={finishing}
                      hasIncompleteParts={technicianHasParts(assignment.id)}
                    />
                  ))}
              </TechnicianGrid>
            </Card>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.1fr",
              gap: "5px",
            }}
          >
            <Card>
              <SectionHeader>
                <h2>New Assignments ({selectedTechnicians.length})</h2>
                {selectedTechnicians.length > 0 && (
                  <ButtonGroup>
                    {techReassigning ? (
                      <ColorSpinner width="3em" height="3em" />
                    ) : (
                      <>
                        <ClearButton onClick={() => setSelectedTechnicians([])}>
                          Clear All
                        </ClearButton>
                        <SubmitButton onClick={handleSubmit}>
                          <CheckCircle size={20} />
                          Confirm Re-Assignment
                        </SubmitButton>
                      </>
                    )}
                  </ButtonGroup>
                )}
              </SectionHeader>

              {selectedTechnicians.length === 0 ? (
                <EmptyState>
                  <User size={48} />
                  <p>No new technicians selected</p>
                  <p>Search below to add technicians</p>
                </EmptyState>
              ) : (
                <TechnicianGrid>
                  {selectedTechnicians.map((assignment) => (
                    <TechnicianCard
                      key={assignment.technicianID}
                      technician={assignment.technician}
                      onRemove={() =>
                        handleRemoveTechnician(assignment.technicianID)
                      }
                      isSelected
                    />
                  ))}
                </TechnicianGrid>
              )}
            </Card>
            <Card>
              <SectionHeader>
                <h2>Services ({appointment.services.length})</h2>
              </SectionHeader>
              {appointment.services.length === 0 ? (
                <EmptyState>
                  <User size={48} />
                  <p>No services</p>
                </EmptyState>
              ) : (
                <ServiceGrid>
                  {appointment.services.map((service) => {
                    const techCount = getTechnicianCountForService(service.id);
                    const isHighlighted = techCount > 0;
                    return (
                      <ServiceTag key={service.id} $highlight={isHighlighted}>
                        {service.name}
                        {!isHighlighted && (
                          <Tooltip
                            title="No technicians have been assigned to this service yet"
                            color="#00ad4e"
                          >
                            <PiWarning color="orange" size={20} />
                          </Tooltip>
                        )}
                        {techCount > 0 && (
                          <span
                            style={{
                              textAlign: "center",
                              marginLeft: "6px",
                              color: "#00ad4e",
                              fontWeight: 600,
                            }}
                          >
                            ({techCount} tech{techCount > 1 ? "s" : ""})
                          </span>
                        )}
                      </ServiceTag>
                    );
                  })}
                </ServiceGrid>
              )}
            </Card>
          </div>

          <Card>
            <SectionHeader>
              <h2>Add Technician</h2>
            </SectionHeader>

            <SearchWrapper>
              <SearchInput>
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search available technicians..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchInput>
            </SearchWrapper>

            <SearchResultsContainer>
              {isFetching ? (
                <SpinnerWrapper>
                  <ColorSpinner width="4em" height="4em" />
                </SpinnerWrapper>
              ) : (
                <TechnicianGrid>
                  {filteredTechnicians.map((technician) => (
                    <TechnicianCard
                      key={technician.id}
                      technician={technician}
                      onAdd={() => handleAddTechnician(technician)}
                    />
                  ))}
                </TechnicianGrid>
              )}

              {filteredTechnicians.length === 0 && (
                <EmptyState>
                  <User size={48} />
                  <p>No technicians found</p>
                </EmptyState>
              )}
            </SearchResultsContainer>
          </Card>
        </ContentWrapper>
      </PageContainer>

      {selectedTechnicianForParts && isPartModalOpen && (
        <PartReassignmentModal
          onClose={() => {
            setIsPartModalOpen(false);
            setSelectedTechnicianForParts(null);
          }}
          onConfirm={handlePartReassignmentConfirm}
          technician={selectedTechnicianForParts}
          pendingParts={pendingPart?.data}
          partReassigning={partReassigning}
        />
      )}

      {isSuccessModalOpen && (
        <SuccessModal
          header="Assign Technician"
          message={modalMessage}
          action={handleCloseModal}
        />
      )}
      {isErrorModalOpen && (
        <FailedModal
          header="Assign Technician"
          message={modalMessage}
          action={handleCloseModal}
        />
      )}
    </>
  );
}

interface TechnicianCardProps {
  technician: TechnicianModel<TechnicianSkills>;
  onAdd?: () => void;
  onRemove?: () => void;
  onFinishSession?: () => void;
  isSelected?: boolean;
  isPreviouslyAssigned?: boolean;
  showFinish?: boolean;
  isFinishing?: boolean;
  hasIncompleteParts?: boolean;
}
export const TechnicianCard = ({
  technician,
  showFinish,
  onAdd,
  onRemove,
  onFinishSession,
  isSelected = false,
  isPreviouslyAssigned = false,
  isFinishing = false,
  hasIncompleteParts = false,
}: TechnicianCardProps) => {
  const [showAllSkills, setShowAllSkills] = useState(false);
  const displayedSkills = showAllSkills
    ? technician.skills
    : technician.skills.slice(0, 3);

  return (
    <TechnicianCardWrapper
      $isSelected={isSelected}
      $isPrevious={isPreviouslyAssigned}
    >
      {isSelected && onRemove && (
        <RemoveButton onClick={onRemove}>
          <CircleX />
        </RemoveButton>
      )}

      {isPreviouslyAssigned && (
        <PreviousBadge>Currently Assigned</PreviousBadge>
      )}

      {hasIncompleteParts &&
        isPreviouslyAssigned &&
        technician.status === "OnLeave" && (
          <WarningBadge>
            <AlertTriangle size={14} />
            Has unfinished parts
          </WarningBadge>
        )}

      <TechnicianHeader>
        <Avatar
          src={
            technician.avatar ||
            `https://ui-avatars.com/api/?name=${technician.fullName}&background=00ad4e`
          }
          alt={technician.fullName}
        />
        <TechnicianInfo>
          <h3>{technician.fullName}</h3>
          <TechnicianId>ID: {technician.id}</TechnicianId>
          <StatusBadge $status={technician.status}>
            {technician.status}
          </StatusBadge>
        </TechnicianInfo>
      </TechnicianHeader>

      <TechInfo>
        <ContactInfo>
          {technician.phone && (
            <InfoItem>
              <Phone size={14} /> {technician.phone}
            </InfoItem>
          )}
          {technician.email && (
            <InfoItem>
              <Mail size={14} /> {technician.email}
            </InfoItem>
          )}
        </ContactInfo>

        <WorkInfo>
          <InfoItem>
            KPI:{" "}
            <StatusBadge $status={technician.status}>
              {technician.kpiPerDays}
            </StatusBadge>
          </InfoItem>

          <InfoItem>
            Completed Orders:{" "}
            <StatusBadge $status={technician.status}>
              {technician.completedOrders}
            </StatusBadge>
          </InfoItem>
        </WorkInfo>
      </TechInfo>

      <SkillsSection>
        <p>SKILLS</p>
        <SkillTags>
          {displayedSkills.map((skill) => (
            <SkillTag key={skill.id}>{skill.name}</SkillTag>
          ))}
          {technician.skills.length > 3 && (
            <button
              onClick={() => setShowAllSkills(!showAllSkills)}
              style={{
                background: "none",
                border: "none",
                color: "#00ad4e",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
                marginLeft: "4px",
              }}
            >
              {showAllSkills ? "Show less" : "Show more"}
            </button>
          )}
        </SkillTags>
      </SkillsSection>

      {onAdd && (
        <ActionButton
          onClick={onAdd}
          $disabled={technician.status !== "Available"}
          disabled={technician.status !== "Available"}
        >
          Add Technician
        </ActionButton>
      )}

      {isPreviouslyAssigned &&
        showFinish &&
        technician.status === "OnLeave" &&
        (isFinishing ? (
          <ColorSpinner width="2em" height="2em" />
        ) : (
          <ActionButton onClick={onFinishSession}>
            {hasIncompleteParts ? "Reassign Parts & Finish" : "Finish Session"}
          </ActionButton>
        ))}
    </TechnicianCardWrapper>
  );
};

import {
  ActionButton,
  Avatar,
  ButtonGroup,
  Card,
  ClearButton,
  ContentWrapper,
  ContactInfo,
  EmptyState,
  Header,
  InfoItem,
  PageContainer,
  PreviousBadge,
  RemoveButton,
  SearchInput,
  SearchResultsContainer,
  SearchWrapper,
  SectionHeader,
  SkillsSection,
  SpinnerWrapper,
  SkillTag,
  SkillTags,
  StatusBadge,
  SubmitButton,
  TechnicianCardWrapper,
  TechnicianGrid,
  TechnicianHeader,
  TechnicianId,
  TechnicianInfo,
  TechInfo,
  WorkInfo,
  BackButton,
  ServiceGrid,
  ServiceTag,
  WarningBadge,
} from "./styles/Appointment_Reassign.styled";
