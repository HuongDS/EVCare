import { useState, useEffect, useCallback } from "react";
import { X, AlertTriangle, User, Search, CheckCircle } from "lucide-react";
import type {
  TechnicianModel,
  TechnicianSkills,
} from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import ColorSpinner from "../StaffComponents/ColorSpinner";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalContent,
  WarningBanner,
  PartsList,
  PartItem,
  PartInfo,
  PartName,
  CurrentTechInfo,
  ModalFooter,
  CancelButton,
  ConfirmButton,
  SelectWrapper,
  SelectLabel,
  NoTechniciansMessage,
  PartAssignmentBlock,
  TechSearchInput,
  TechSearchWrapper,
  TechSearchResult,
  TechAvatar,
  TechDetails,
  TechName,
  TechStatus,
  AssignmentPill,
  RemoveAssignmentButton,
  AssignmentDetails,
  TechnicianCardDetail,
  CardLeft,
  KPI,
} from "./styles/PartReassignmentModal.styled";
import type { PartPendingDto } from "../../../models/PartModel/PartModel";
import { useGetTechnicianForPendingParts } from "../../../services/appointmentServiceApi";
import type { PartPendingUpdate } from "../../../models/OrderModel/UpdateOrderModel";
import TextWaitingEffect from "../StaffComponents/TextWaitingEffect";

interface PartReassignmentModalProps {
  onClose: () => void;
  onConfirm: (reassignments: PartPendingUpdate[]) => void;
  technician: TechnicianModel<TechnicianSkills>;
  isLoading?: boolean;
  partReassigning?: boolean;
  pendingParts?: PartPendingDto[];
}

export default function PartReassignmentModal({
  onClose,
  onConfirm,
  technician,
  isLoading = false,
  pendingParts,
  partReassigning,
}: PartReassignmentModalProps) {
  const [searchTechPart, setSearchTechPart] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const { data: availableTechnicians, isLoading: isSearching } =
    useGetTechnicianForPendingParts({
      ...((debouncedSearchTerm && { keyWord: debouncedSearchTerm }) || {}),
      partIds: pendingParts?.map((part) => part.id),
      pageSize: 10,
    });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTechPart.trim());
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTechPart]);

  const [reassignments, setReassignments] = useState<Map<number, number>>(
    new Map()
  );

  const handleSelectTechnician = useCallback(
    (partId: number, newTechId: number) => {
      setReassignments((prev) => {
        const newMap = new Map(prev);
        newMap.set(partId, newTechId);
        return newMap;
      });
      setSearchTechPart("");
      setDebouncedSearchTerm("");
    },
    []
  );

  const handleRemoveTechnician = (partId: number) => {
    setReassignments((prev) => {
      const newMap = new Map(prev);
      newMap.delete(partId);
      return newMap;
    });
  };

  const allPartsReassigned = pendingParts?.every((part) =>
    reassignments.has(part.id)
  );

  const handleConfirm = async () => {
    if (!pendingParts || !allPartsReassigned) return;

    const reassignmentData: PartPendingUpdate[] = pendingParts.map((part) => {
      const newTechId = reassignments.get(part.id);
      if (!newTechId) throw new Error(`Part ${part.id} is unassigned.`);

      return {
        partId: part.id,
        oldTechnicianId: technician.id,
        newTechnicianId: newTechId,
      };
    });

    try {
      await onConfirm(reassignmentData);
      onClose();
    } catch (error) {
      console.error("Failed to reassign parts in modal:", error);
    }
  };

  const getTechDetails = (techId: number) => {
    return availableTechnicians?.data?.items?.find(
      (tech) => tech.id === techId
    );
  };

  const getAvatarUrl = (name: string, status: string): string => {
    let background = "00ad4e";
    if (status === "Busy" || status === "Unassigned") background = "ff9800";
    return `https://ui-avatars.com/api/?name=${name}&background=${background}&color=fff`;
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <AlertTriangle size={24} color="#ff9800" />
            Unfinished Parts Detected
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <WarningBanner>
            <AlertTriangle size={20} />
            <div>
              <strong>{technician.fullName}</strong> has{" "}
              <strong>{pendingParts?.length}</strong> unfinished part(s).
              <br />
              Please reassign these parts to available technicians before
              finishing the session.
            </div>
          </WarningBanner>

          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "40px",
              }}
            >
              <ColorSpinner width="4em" height="4em" />
            </div>
          ) : (
            <PartsList>
              {pendingParts?.map((part) => {
                const partId = part.id;
                const selectedTechId = reassignments.get(partId);
                const isAssigned = !!selectedTechId;

                const assignedTech = isAssigned
                  ? getTechDetails(selectedTechId)
                  : null;
                const statusColor = "#00ad4e";

                const allAvailableTechsCount =
                  availableTechnicians?.data?.items?.filter(
                    (tech) =>
                      tech.status === "Available" && tech.id !== selectedTechId
                  ).length;

                const showLimitedMessage =
                  !isAssigned && (allAvailableTechsCount || 0) > 3;

                return (
                  <PartItem key={part.id}>
                    <PartInfo>
                      <PartName>{part.name}</PartName>
                      <CurrentTechInfo>
                        Currently assigned to:{" "}
                        <strong>{technician.fullName}</strong>
                      </CurrentTechInfo>
                    </PartInfo>

                    <SelectWrapper>
                      <SelectLabel>
                        {isAssigned
                          ? "Reassigned to:"
                          : "Search and assign new technician:"}
                      </SelectLabel>

                      <PartAssignmentBlock>
                        {isAssigned && assignedTech ? (
                          <AssignmentPill>
                            <AssignmentDetails>
                              <TechAvatar
                                src={getAvatarUrl(
                                  assignedTech.fullName,
                                  assignedTech.status
                                )}
                                alt="Assigned Tech Avatar"
                              />
                              <TechDetails>
                                <TechName $selected={true}>
                                  {assignedTech.fullName}
                                </TechName>
                                <TechStatus $statusColor={statusColor}>
                                  <CheckCircle
                                    size={12}
                                    style={{ marginRight: "4px" }}
                                  />
                                  {assignedTech.status}
                                </TechStatus>
                              </TechDetails>
                            </AssignmentDetails>
                            <RemoveAssignmentButton
                              onClick={() => handleRemoveTechnician(partId)}
                            >
                              <X size={16} />
                            </RemoveAssignmentButton>
                          </AssignmentPill>
                        ) : (
                          <>
                            <TechSearchWrapper>
                              <Search size={18} />
                              <TechSearchInput
                                type="text"
                                placeholder="Search technician by name..."
                                value={searchTechPart}
                                onChange={(e) =>
                                  setSearchTechPart(e.target.value)
                                }
                              />
                            </TechSearchWrapper>

                            {isSearching ? (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  margin: "5px 0",
                                }}
                              >
                                <ColorSpinner width="2em" height="2em" />
                              </div>
                            ) : (availableTechnicians?.data?.items?.length ||
                                0) > 0 ? (
                              <TechSearchResult>
                                {availableTechnicians?.data?.items?.map(
                                  (tech) => (
                                    <TechnicianCardDetail
                                      key={tech.id}
                                      onClick={() =>
                                        handleSelectTechnician(partId, tech.id)
                                      }
                                    >
                                      <CardLeft>
                                        <TechAvatar
                                          src={getAvatarUrl(
                                            tech.fullName,
                                            tech.status
                                          )}
                                          alt="Tech Avatar"
                                        />
                                        <TechDetails>
                                          <TechName $selected={true}>
                                            {tech.fullName}
                                          </TechName>
                                          <TechStatus
                                            $statusColor={statusColor}
                                          >
                                            <CheckCircle
                                              size={12}
                                              style={{ marginRight: "4px" }}
                                            />
                                            {tech.status}
                                          </TechStatus>
                                        </TechDetails>
                                      </CardLeft>

                                      <KPI $selected={true}>
                                        KPI: {tech.kpiPerDays}
                                      </KPI>
                                    </TechnicianCardDetail>
                                  )
                                )}

                                {showLimitedMessage && (
                                  <NoTechniciansMessage
                                    style={{
                                      marginTop: "10px",
                                      background: "#e8f5ee",
                                      color: "#00ad4e",
                                      border: "1px solid #00ad4e55",
                                    }}
                                  >
                                    Showing 3 of {allAvailableTechsCount}{" "}
                                    available. Type to search all.
                                  </NoTechniciansMessage>
                                )}
                              </TechSearchResult>
                            ) : null}

                            {availableTechnicians?.data?.items?.length ===
                              0 && (
                              <NoTechniciansMessage
                                style={{ marginTop: "10px" }}
                              >
                                <User size={16} />
                                No available technicians found matching "
                                {searchTechPart}"
                              </NoTechniciansMessage>
                            )}

                            {allAvailableTechsCount === 0 && (
                              <NoTechniciansMessage
                                style={{ marginTop: "10px" }}
                              >
                                <User size={16} />
                                No available technicians for this part.
                              </NoTechniciansMessage>
                            )}
                          </>
                        )}
                      </PartAssignmentBlock>
                    </SelectWrapper>
                  </PartItem>
                );
              })}
            </PartsList>
          )}
        </ModalContent>

        <ModalFooter>
          <CancelButton onClick={onClose} disabled={partReassigning}>
            Cancel
          </CancelButton>
          {partReassigning ? (
            <>
              <TextWaitingEffect text="Re-assign Processing" fontSize="20px" />
            </>
          ) : (
            <ConfirmButton onClick={handleConfirm}>
              Confirm Reassignment
            </ConfirmButton>
          )}
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
}
