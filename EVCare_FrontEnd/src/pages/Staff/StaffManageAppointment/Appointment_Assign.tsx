import { useState } from "react";
import styled from "styled-components";
import { Search, User, Phone, CheckCircle, CircleX } from "lucide-react";
import type { TechnicianModel } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import type { TechnicianSkills } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import type { StaffAppointmentsDto } from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import {
  // changeAppointmentStatus,
  useAssignTechnician,
  useChangeAppointmentStatus,
  useGetTechniciansToday,
} from "../../../services/appointmentServiceApi";
import { useAppDispatch } from "../../../states/store";
import { setStep } from "../../../states/appointmentSlice";
import { handleError } from "../../../utils/errorHandler";
import SuccessModal from "../../../components/StatusModal/SuccessModal";
import FailedModal from "../../../components/StatusModal/FailModal";
import SpinnerComponent from "../../../components/SpinnerComponent";
import { useQueryClient } from "@tanstack/react-query";

interface AssignedTechnician {
  technicianID: number;
  technician: TechnicianModel<TechnicianSkills>;
  startedTime: string;
}

interface props {
  data: StaffAppointmentsDto<TechnicianModel<TechnicianSkills>>;
  currentStep: number;
}
const AssignTechnicianPage = ({ data, currentStep }: props) => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechnicians, setSelectedTechnicians] = useState<
    AssignedTechnician[]
  >([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const queryClient = useQueryClient();

  const allSkills = data.services.map((service) => service.id).flat();

  const { data: technicians } = useGetTechniciansToday({
    Skills: allSkills,
    // Status: "Available",
  });

  //search technician hiện có
  const filteredTechnicians =
    technicians?.data?.items
      ?.flat()
      .filter(
        (tech) =>
          tech.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !selectedTechnicians.some((st) => st.technicianID === tech.id)
      ) || [];

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
  const handleAssignTechnician = async () => {
    try {
      console.log("Orderid: " + data.orderId);
      await assignTech({
        orderId: data.orderId,
        technicianIds: techniciansList,
        status: "Pending",
      });

      await queryClient.invalidateQueries({ queryKey: ["Staff Appointments"] });
      setIsSuccessModalOpen(true);
      setModalMessage("Assign Technicians successfully!");
    } catch (error) {
      handleError(error);
      setIsErrorModalOpen(true);
      setModalMessage((error as Error).message);
    }
  };

  //đổi trang thái appointment
  const { mutateAsync: appointmentStatus } = useChangeAppointmentStatus();
  const handleChangeStep = async () => {
    setIsSuccessModalOpen(false);
    await appointmentStatus({
      appointmentId: data.id,
      status: "AddingPart",
    });
    dispatch(setStep({ id: data.id, step: currentStep + 1 }));
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

        <Card>
          <SectionHeader>
            <h2>Assigned Technicians ({selectedTechnicians.length})</h2>
            {selectedTechnicians.length > 0 && (
              <ButtonGroup>
                <ClearButton onClick={() => setSelectedTechnicians([])}>
                  Clear All
                </ClearButton>
                {isPending ? (
                  <SpinnerComponent />
                ) : (
                  <SubmitButton onClick={handleAssignTechnician}>
                    <CheckCircle size={20} />
                    Assign Technicians
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
          <SearchWrapper>
            <SearchInput>
              <Search size={20} />
              <input
                type="text"
                placeholder="Search technician by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchInput>
          </SearchWrapper>

          <SearchResultsContainer>
            <TechnicianGrid>
              {filteredTechnicians.map((technician) => (
                <TechnicianCard
                  key={technician.id}
                  technician={technician}
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
          action={handleChangeStep}
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
};

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
}: TechnicianCardProps) => {
  return (
    <TechnicianCardWrapper $isSelected={isSelected}>
      {isSelected && onRemove && (
        <RemoveButton onClick={onRemove}>
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
          Add
        </ActionButton>
      )}
    </TechnicianCardWrapper>
  );
};

export default AssignTechnicianPage;

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #93c6a2 0%, #e8eaf6 100%);
  border-radius: 20px;
  padding: 24px;
  font-family: "Outfit", sans-serif;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 20px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 10px;
  }
`;

const Header = styled.div`
  h1 {
    font-size: 24px;
    font-weight: 700;
    color: #00ad4e;
    margin: 0 0 4px 0;

    @media (max-width: 768px) {
      font-size: 20px;
    }
  }

  p {
    color: #666;
    margin: 0;
    font-size: 14px;

    @media (max-width: 768px) {
      font-size: 13px;
    }
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;

  h2 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 16px;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px 20px;
  color: #999;

  svg {
    margin: 0 auto 12px;
    opacity: 0.5;
  }

  p:first-of-type {
    font-size: 16px;
    margin-bottom: 4px;
  }

  p:last-of-type {
    font-size: 13px;
  }
`;

const TechnicianGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const SearchWrapper = styled.div`
  margin-bottom: 16px;
`;

const SearchInput = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }

  input {
    width: 100%;
    padding: 12px 12px 12px 40px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 14px;
    font-family: "Outfit", sans-serif;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #2196f3;
      box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
    }

    @media (max-width: 768px) {
      padding: 10px 10px 10px 36px;
      font-size: 13px;
    }
  }
`;

const SearchResultsContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #2196f3;
    border-radius: 10px;
  }
`;

const TechnicianCardWrapper = styled.div<{ $isSelected?: boolean }>`
  position: relative;
  border: 2px solid ${(props) => (props.$isSelected ? "#2196f3" : "#e0e0e0")};
  background: ${(props) => (props.$isSelected ? "#e3f2fd" : "white")};
  border-radius: 10px;
  padding: 16px;
  transition: all 0.3s ease;

  ${(props) =>
    !props.$isSelected &&
    `
    &:hover {
      border-color: #2196f3;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
    }
  `}

  @media (max-width: 768px) {
    padding: 14px;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f44336;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(244, 67, 54, 0.3);

  &:hover {
    background: #d32f2f;
    transform: scale(1.1);
  }
`;

const TechnicianHeader = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`;

const Avatar = styled.img`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0e0e0;

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }
`;

const TechnicianInfo = styled.div`
  flex: 1;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 6px 0;

    @media (max-width: 768px) {
      font-size: 15px;
    }
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  border: 1px solid;

  ${(props) => {
    switch (props.$status) {
      case "Available":
        return `
          background: #e8f5e9;
          color: #2e7d32;
          border-color: #a5d6a7;
        `;
      case "Busy":
        return `
          background: #fff3e0;
          color: #e65100;
          border-color: #ffcc80;
        `;
      case "OnLeave":
        return `
          background: #f5f5f5;
          color: #616161;
          border-color: #e0e0e0;
        `;
      default:
        return `
          background: #f5f5f5;
          color: #616161;
          border-color: #e0e0e0;
        `;
    }
  }}
`;

const InfoSection = styled.div`
  margin-bottom: 12px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 13px;
  margin-bottom: 6px;

  svg {
    color: #999;
    flex-shrink: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const SkillsSection = styled.div`
  margin-bottom: 12px;

  p {
    font-size: 10px;
    font-weight: 700;
    color: #999;
    margin: 0 0 6px 0;
    letter-spacing: 0.5px;
  }
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const SkillTag = styled.span<{ $isMore?: boolean }>`
  padding: 4px 10px;
  background: ${(props) => (props.$isMore ? "#f5f5f5" : "#e8eaf6")};
  color: ${(props) => (props.$isMore ? "#666" : "#3f51b5")};
  font-size: 11px;
  font-weight: 500;
  border-radius: 12px;
`;

const ActionButton = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  font-family: "Outfit", sans-serif;

  ${(props) =>
    props.$disabled
      ? `
    background: #e0e0e0;
    color: #9e9e9e;
  `
      : `
    background: #2196f3;
    color: white;
    box-shadow: 0 2px 6px rgba(33, 150, 243, 0.3);

    &:hover {
      background: #1976d2;
      box-shadow: 0 3px 8px rgba(33, 150, 243, 0.4);
    }
  `}
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ClearButton = styled.button`
  padding: 12px 24px;
  background: #e0e0e0;
  color: #666;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Outfit", sans-serif;

  &:hover {
    background: #d5d5d5;
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 13px;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  font-family: "Outfit", sans-serif;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 13px;
  }
`;

// const StarIcon = styled(Star)`
//   fill: #ffc107;
//   color: #ffc107;
// `;
