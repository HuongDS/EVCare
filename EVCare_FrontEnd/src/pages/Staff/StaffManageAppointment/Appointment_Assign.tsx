import { useState } from "react";
import { Search, User, Phone, CheckCircle, CircleX } from "lucide-react";
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
import {
  ActionButton,
  Avatar,
  ButtonGroup,
  ClearButton,
  ContentWrapper,
  EmptyState,
  Header,
  InfoItem,
  InfoSection,
  PageContainer,
  RemoveButton,
  SearchInput,
  SearchResultsContainer,
  SearchWrapper,
  SectionHeader,
  ServiceGrid,
  ServiceTag,
  SkillsSection,
  SkillTag,
  SkillTags,
  StatusBadge,
  SubmitButton,
  TechnicianCardWrapper,
  TechnicianGrid,
  TechnicianHeader,
  TechnicianInfo,
} from "./styles/Appointment_Assign.styled";
import { Card } from "antd";

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

  //Add technician vào list
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

  //đóng error modal
  const handleCloseModal = () => {
    setIsErrorModalOpen(false);
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
                {data.services.map((service) => (
                  <ServiceTag key={service.id}>{service.name}</ServiceTag>
                ))}
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
  return (
    <TechnicianCardWrapper $isSelected={isSelected} {...rest}>
      {isSelected && onRemove && (
        <RemoveButton onClick={onRemove} data-testid="remove-button">
          <CircleX />
        </RemoveButton>
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
          <StatusBadge $status={technician.status}>
            {technician.status}
          </StatusBadge>
        </TechnicianInfo>
      </TechnicianHeader>

      <InfoSection>
        {technician.phone && (
          <InfoItem>
            <Phone size={14} /> {technician.phone}
          </InfoItem>
        )}
      </InfoSection>

      <SkillsSection>
        <p>SKILLS</p>
        <SkillTags>
          {technician.skills.map((skill) => (
            <SkillTag key={skill.id}>{skill.name}</SkillTag>
          ))}
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
