import { Tooltip } from "antd";
import type {
  TechnicianModel,
  TechnicianSkills,
} from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import {
  useAssignTechnician,
  useGetAppointmentById,
  useGetTechniciansToday,
} from "../../../services/appointmentServiceApi";
import { useState } from "react";
import { CheckCircle, CircleX, Mail, Phone, Search, User } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import SuccessModal from "../../../components/StatusModal/SuccessModal";
import FailedModal from "../../../components/StatusModal/FailModal";
import { handleError } from "../../../utils/errorHandler";
import ErrorPage from "../StaffComponents/Error";
import ColorSpinner from "../StaffComponents/ColorSpinner";
import { PiWarning } from "react-icons/pi";
import { ServiceGrid, ServiceTag } from "./styles/Appointment_Assign.styled";
import { useFinishTechnicianSession } from "../../../services/TechnicianWorkingSessionApi";
import { useNotification } from "../../../context/useNotification";

interface props {
  show: boolean;
  close: () => void;
  appointmentId: number;
}

interface AssignedTechnician {
  technicianID: number;
  technician: TechnicianModel<TechnicianSkills>;
  startedTime: string;
}

export default function Appointment_Reassign({
  show,
  close,
  appointmentId,
}: props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechnicians, setSelectedTechnicians] = useState<
    AssignedTechnician[]
  >([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const notification = useNotification();

  const {
    data: appointmentDetail,
    isLoading,
    error,
    refetch,
  } = useGetAppointmentById(appointmentId);
  const { mutateAsync: reAssign } = useAssignTechnician();
  const { data: technicians, isFetching } = useGetTechniciansToday({
    Status: "Available",
  });
  const { mutateAsync: finishSession } = useFinishTechnicianSession();

  if (isLoading) {
    return (
      <ModalStyled open={show} onCancel={close} footer={null}>
        <ContentWrapper>
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
            }}
          >
            <ColorSpinner width="5em" height="5em" />
          </div>
        </ContentWrapper>
      </ModalStyled>
    );
  }

  if (error) {
    notification.error({
      message: "Appointment",
      description: error?.message || "Failed to load appointment details",
      showProgress: true,
    });
    return (
      <ModalStyled open={show} onCancel={close} footer={null}>
        <ContentWrapper>
          <ErrorPage onGoHome={close} onRetry={refetch} />
        </ContentWrapper>
      </ModalStyled>
    );
  }

  if (!appointmentDetail?.data) {
    return (
      <ModalStyled open={show} onCancel={close} footer={null}>
        <ContentWrapper>
          <ErrorPage onGoHome={close} onRetry={refetch} />
        </ContentWrapper>
      </ModalStyled>
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

  const handleSubmit = async () => {
    await handleReAssign();

    const techniciansLeave = appointment.technicians
      .filter((tech) => tech.status === "OnLeave")
      .map((tech) => tech.id);
    if (techniciansLeave.length > 0) {
      await handleFinishSession(techniciansLeave);
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

  return (
    <>
      <ModalStyled open={show} onCancel={close} footer={null}>
        <PageContainer>
          <ContentWrapper>
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
                        assignmentInfo={{
                          technicianID: assignment.id,
                        }}
                        isPreviouslyAssigned
                        technicianLength={appointment.technicians.length}
                        onFinishSession={() =>
                          handleFinishSession([assignment.id])
                        }
                      />
                    ))}
                </TechnicianGrid>
              </Card>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "5px",
              }}
            >
              <Card>
                <SectionHeader>
                  <h2>New Assignments ({selectedTechnicians.length})</h2>
                  {selectedTechnicians.length > 0 && (
                    <ButtonGroup>
                      <ClearButton onClick={() => setSelectedTechnicians([])}>
                        Clear All
                      </ClearButton>
                      <SubmitButton onClick={handleSubmit}>
                        <CheckCircle size={20} />
                        Confirm Re-Assignment
                      </SubmitButton>
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
                      const techCount = getTechnicianCountForService(
                        service.id
                      );
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
                <TechnicianGrid>
                  {isFetching ? (
                    <SpinnerWrapper>
                      <ColorSpinner width="3em" height="3em" />
                    </SpinnerWrapper>
                  ) : (
                    filteredTechnicians.map((technician) => (
                      <TechnicianCard
                        key={technician.id}
                        technician={technician}
                        onAdd={() => handleAddTechnician(technician)}
                      />
                    ))
                  )}
                </TechnicianGrid>

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
      </ModalStyled>
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
  assignmentInfo?: {
    technicianID: number;
  };
  technicianLength?: number;
}
export const TechnicianCard = ({
  technician,
  onAdd,
  onRemove,
  onFinishSession,
  isSelected = false,
  isPreviouslyAssigned = false,
  assignmentInfo,
  technicianLength = 1,
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
          <TechnicianId>
            ID: {assignmentInfo?.technicianID || technician.id}
          </TechnicianId>
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
        technicianLength > 1 &&
        technician.status === "OnLeave" && (
          <ActionButton onClick={onFinishSession}>Finish Session</ActionButton>
        )}
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
  ModalStyled,
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
} from "./styles/Appointment_Reassign.styled";
