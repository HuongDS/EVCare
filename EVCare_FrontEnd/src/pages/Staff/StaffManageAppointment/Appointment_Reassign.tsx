import { Modal, notification } from "antd";

import styled from "styled-components";
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

            {/* Search Section */}
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

const ModalStyled = styled(Modal)`
  display: flex;
  justify-content: center;
  top: 2%;
  .ant-modal-content {
    width: 1000px !important;
    height: 94vh !important;
    overflow: hidden;
  }
`;

const PageContainer = styled.div`
  margin-top: 3%;
  height: 100%;
  max-height: 85vh;
  background: linear-gradient(135deg, #93c6a2 0%, #e8eaf6 100%);
  border-radius: 20px;
  padding: 24px;
  overflow-y: auto;
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

const TechnicianCardWrapper = styled.div<{
  $isSelected?: boolean;
  $isPrevious?: boolean;
}>`
  position: relative;
  border: 2px solid
    ${(props) =>
      props.$isPrevious
        ? "#00ad4e"
        : props.$isSelected
        ? "#2196f3"
        : "#e0e0e0"};
  background: ${(props) =>
    props.$isPrevious ? "#e8f5e9" : props.$isSelected ? "#e3f2fd" : "white"};
  border-radius: 10px;
  padding: 16px;
  transition: all 0.3s ease;

  ${(props) =>
    !props.$isSelected &&
    !props.$isPrevious &&
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

const PreviousBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  background: #00ad4e;
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 173, 78, 0.3);
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
    margin: 0 0 4px 0;

    @media (max-width: 768px) {
      font-size: 15px;
    }
  }
`;

const TechnicianId = styled.div`
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
  font-weight: 500;
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
  margin-top: auto;

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
