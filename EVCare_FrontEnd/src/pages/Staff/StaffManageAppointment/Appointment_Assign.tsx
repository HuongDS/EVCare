import { useState } from "react";
import { Search, User, Phone, CheckCircle, CircleX, Mail } from "lucide-react";
import type { TechnicianModel } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import type { TechnicianSkills } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import type { AppointmentDetailModel } from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import {
  useAssignTechnician,
  useChangeAppointmentStatus,
  useGetTechniciansToday,
} from "../../../services/appointmentServiceApi";
import { handleError } from "../../../utils/errorHandler";
import SuccessModal from "../../../components/StatusModal/SuccessModal";
import FailedModal from "../../../components/StatusModal/FailModal";
import { useQueryClient } from "@tanstack/react-query";
import ColorSpinner from "../StaffComponents/ColorSpinner";

interface AssignedTechnician {
  technicianID: number;
  technician: TechnicianModel<TechnicianSkills>;
  startedTime: string;
}

interface props {
  data: AppointmentDetailModel<TechnicianModel<TechnicianSkills>>;
}
export default function Appointment_Assign({ data }: props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechnicians, setSelectedTechnicians] = useState<
    AssignedTechnician[]
  >([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const queryClient = useQueryClient();

  const allSkills = data.services.map((service) => service.id);

  const { data: technicians } = useGetTechniciansToday({
    Skills: allSkills,
    // Status: "Available",
  });

  //search technician hiện có
  const filteredTechnicians =
    technicians?.data?.items?.filter((tech) => {
      const nameMatch = tech.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const skillMatch = tech.skills.some((skill) =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const notSelected = !selectedTechnicians.some(
        (st) => st.technicianID === tech.id
      );
      return (nameMatch || skillMatch) && notSelected;
    }) || [];

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

  //xóa technician ra khỏi list
  const handleRemoveTechnician = (technicianID: number) => {
    setSelectedTechnicians(
      selectedTechnicians.filter((st) => st.technicianID !== technicianID)
    );
  };

  //lấy mảng id các technician để gán qua api
  const techniciansList = selectedTechnicians
    .map((tech) => tech.technicianID)
    .flat();

  //Thay đổi appointment status - gán technicians vào appointment
  const { mutateAsync: assignTech, isPending } = useAssignTechnician();
  const { mutateAsync: appointmentStatus } = useChangeAppointmentStatus();
  const handleAssignTechnician = async () => {
    try {
      await assignTech({
        orderId: data.orderId,
        technicianIds: techniciansList,
        status: "Pending",
      });

      await appointmentStatus({
        appointmentId: data.id,
        status: "AddingPart",
      });
      setModalMessage("Assign Technicians successfully!");
      setIsSuccessModalOpen(true);
    } catch (error) {
      handleError(error);
      setIsErrorModalOpen(true);
      setModalMessage((error as Error).message);
    }
  };

  const onAssignSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ["AppointmentDetail"] });
    setIsSuccessModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsErrorModalOpen(false);
  };

  const getTechnicianCountForService = (serviceId: number) => {
    return selectedTechnicians.filter((tech) =>
      tech.technician.skills.some((skill) => skill.id === serviceId)
    ).length;
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <Card>
          <Header>
            <h1>Assign Technicians</h1>
            <p>Select technicians to assign to this appointment</p>
          </Header>
        </Card>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "5px",
          }}
        >
          <Card data-testid="assigned-technicians-list">
            <SectionHeader>
              <h2>Assigned Technicians ({selectedTechnicians.length})</h2>
              {selectedTechnicians.length > 0 && (
                <ButtonGroup>
                  <ClearButton
                    onClick={() => setSelectedTechnicians([])}
                    disabled={isPending}
                  >
                    Clear All
                  </ClearButton>
                  {isPending ? (
                    <ColorSpinner width="3em" height="3em" />
                  ) : (
                    <SubmitButton onClick={handleAssignTechnician}>
                      <CheckCircle size={20} />
                      Assign
                    </SubmitButton>
                  )}
                </ButtonGroup>
              )}
            </SectionHeader>

            {selectedTechnicians.length === 0 ? (
              <EmptyState>
                <User size={48} />
                <p>No technicians assigned yet</p>
                <p>Scroll down to "Add Technician"</p>
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
              <h2>Services ({data.services.length})</h2>
            </SectionHeader>
            {data.services.length === 0 ? (
              <EmptyState>
                <User size={48} />
                <p>No services</p>
              </EmptyState>
            ) : (
              <ServiceGrid>
                {data.services.map((service) => {
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
          <SearchWrapper>
            <SearchInput>
              <Search size={20} />
              <input
                type="text"
                placeholder="Search technician by name or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchInput>
          </SearchWrapper>

          <SearchResultsContainer data-testid="search-results-container">
            <TechnicianGrid>
              {filteredTechnicians.map((technician) => (
                <TechnicianCard
                  key={technician.id}
                  technician={technician}
                  data-testid={`technician-card-${technician.id}`}
                  onAdd={() => handleAddTechnician(technician)}
                />
              ))}
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
      {isSuccessModalOpen && (
        <SuccessModal
          header="Assign Technician"
          message={modalMessage}
          action={onAssignSuccess}
        />
      )}
      {isErrorModalOpen && (
        <FailedModal
          header="Assign Technician"
          message={modalMessage}
          action={handleCloseModal}
        />
      )}
    </PageContainer>
  );
}

interface TechnicianCardProps {
  technician: TechnicianModel<TechnicianSkills>;
  onAdd?: () => void;
  onRemove?: () => void;
  isSelected?: boolean;
}

const TechnicianCard = ({
  technician,
  onAdd,
  onRemove,
  isSelected = false,
  ...rest
}: TechnicianCardProps) => {
  const [showAllSkills, setShowAllSkills] = useState(false);
  const displayedSkills = showAllSkills
    ? technician.skills
    : technician.skills.slice(0, 3);
  return (
    <TechnicianCardWrapper $isSelected={isSelected} {...rest}>
      <TechnicianHeader>
        <Avatar
          src={
            technician.avatar ||
            `https://ui-avatars.com/api/?name=${technician.fullName}&background=00ad4e&color=fff&bold=true`
          }
          alt={technician.fullName}
        />
        <TechnicianInfo>
          <h3>{technician.fullName}</h3>
          <StatusBadge $status={technician.status}>
            {technician.status}
          </StatusBadge>
        </TechnicianInfo>

        {isSelected && onRemove && (
          <RemoveButton onClick={onRemove} data-testid="remove-button">
            <CircleX />
          </RemoveButton>
        )}
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
          Add
        </ActionButton>
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
  PageContainer,
  RemoveButton,
  SearchInput,
  SearchResultsContainer,
  SearchWrapper,
  SectionHeader,
  ServiceGrid,
  ServiceTag,
  SkillTag,
  SkillTags,
  SkillsSection,
  StatusBadge,
  SubmitButton,
  TechnicianCardWrapper,
  TechnicianGrid,
  TechnicianHeader,
  TechnicianInfo,
  TechInfo,
  WorkInfo,
} from "./styles/Appointment_Assign.styled";
import { PiWarning } from "react-icons/pi";
import { Tooltip } from "antd";
