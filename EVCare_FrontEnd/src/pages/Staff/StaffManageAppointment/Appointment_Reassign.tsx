import { notification } from "antd";
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
import { CheckCircle, CircleX, Phone, Search, User } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import SuccessModal from "../../../components/StatusModal/SuccessModal";
import FailedModal from "../../../components/StatusModal/FailModal";
import { handleError } from "../../../utils/errorHandler";
import ErrorPage from "../StaffComponents/Error";
import ColorSpinner from "../StaffComponents/ColorSpinner";
import {
  ActionButton,
  Avatar,
  ButtonGroup,
  Card,
  ClearButton,
  ContentWrapper,
  EmptyState,
  Header,
  InfoItem,
  InfoSection,
  ModalStyled,
  PageContainer,
  PreviousBadge,
  RemoveButton,
  SearchInput,
  SearchResultsContainer,
  SearchWrapper,
  SectionHeader,
  SkillsSection,
  SkillTag,
  SkillTags,
  StatusBadge,
  SubmitButton,
  TechnicianCardWrapper,
  TechnicianGrid,
  TechnicianHeader,
  TechnicianId,
  TechnicianInfo,
} from "./styles/Appointment_Reassign.styled";

interface props {
  show: boolean;
  close: () => void;
  appointmentId: number;
}

export default function Appointment_Reassign({
  show,
  close,
  appointmentId,
}: props) {
  interface AssignedTechnician {
    technicianID: number;
    technician: TechnicianModel<TechnicianSkills>;
    startedTime: string;
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechnicians, setSelectedTechnicians] = useState<
    AssignedTechnician[]
  >([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const {
    data: appointmentDetail,
    isLoading,
    error,
    refetch,
  } = useGetAppointmentById(appointmentId);
  const { mutateAsync: reAssign } = useAssignTechnician();
  //lấy tất cả technicians trừ các technicians đã gán
  const { data: technicians, isFetching } = useGetTechniciansToday({
    Status: "Available",
  });

  if (isLoading) {
    return (
      <ModalStyled open={show} onCancel={close} footer={null}>
        <ContentWrapper>
          <div
            style={{
              position: "absolute",
              // display: "flex",
              // justifyContent: "center",
              // alignItems: "center",
              top: "50%",
              left: "50%",
            }}
          >
            <ColorSpinner />
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

  // Lấy danh sách ID của technician đã được gán (cả trước đó và mới chọn)
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
    const checkStatusForTechnicianAssign = (): "Pending" | "InProgress" => {
      if (appointment.status === "AddingPart") {
        return "Pending";
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
      queryClient.invalidateQueries({ queryKey: ["AppointmentDetail"] });
      setSelectedTechnicians([]);
      setIsSuccessModalOpen(true);
      setModalMessage("ReAssign Technicians successfully");
    } catch (error) {
      handleError(error);
      setIsErrorModalOpen(true);
      setModalMessage("ReAssign Technicians failed! Try again");
    }
  };

  //đóng success, fail modal
  const handleCloseModal = () => {
    setIsErrorModalOpen(false);
    setIsSuccessModalOpen(false);
    close();
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
                  <h2>Currently Assigned ({appointment.technicians.length})</h2>
                </SectionHeader>

                <TechnicianGrid>
                  {appointment.technicians.map((assignment) => (
                    <TechnicianCard
                      key={assignment.id}
                      technician={assignment}
                      assignmentInfo={{
                        technicianID: assignment.id,
                      }}
                      isPreviouslyAssigned
                    />
                  ))}
                </TechnicianGrid>
              </Card>
            )}

            <Card>
              <SectionHeader>
                <h2>New Assignments ({selectedTechnicians.length})</h2>
                {selectedTechnicians.length > 0 && (
                  <ButtonGroup>
                    <ClearButton onClick={() => setSelectedTechnicians([])}>
                      Clear All
                    </ClearButton>
                    <SubmitButton onClick={handleReAssign}>
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
                    <ColorSpinner />
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

                {filteredTechnicians.length === 0 && searchQuery && (
                  <EmptyState>
                    <User size={48} />
                    <p>No available technicians found</p>
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
  isSelected?: boolean;
  isPreviouslyAssigned?: boolean;
  assignmentInfo?: {
    technicianID: number;
  };
}
export const TechnicianCard = ({
  technician,
  onAdd,
  onRemove,
  isSelected = false,
  isPreviouslyAssigned = false,
  assignmentInfo,
}: TechnicianCardProps) => {
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
            `https://ui-avatars.com/api/?name=${technician.fullName}&background=random`
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

      <InfoSection>
        {technician.phone && (
          <InfoItem>
            <Phone size={14} /> {technician.phone ?? "default"}
          </InfoItem>
        )}
      </InfoSection>

      <SkillsSection>
        <p>SKILLS</p>
        <SkillTags>
          {technician.skills.slice(0, 3).map((skill) => (
            <SkillTag key={skill.id}>{skill.name}</SkillTag>
          ))}
          {technician.skills.length > 3 && (
            <SkillTag $isMore>+{technician.skills.length - 3} more</SkillTag>
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
    </TechnicianCardWrapper>
  );
};
