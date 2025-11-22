import { useState } from "react";
import {
  Wrench,
  CheckCircle,
  Clock,
  User,
  Lock,
  ArrowLeft,
} from "lucide-react";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { BackButton } from "../TechnicianOrder/Technician_Order.styled";
import { useUpdatePartStatus } from "../../../services/partApi";
import { useNotification } from "../../../context/useNotification";
import ColorSpinner from "../../Staff/StaffComponents/ColorSpinner";
import {
  ERROR_MESSAGE,
  MSG_TITLE,
  SUCCESS_MESSAGE,
} from "../../../constants/messages/Message";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  appointment: TechnicianAppointmentsDto;
  setIsRepairing: (v: boolean) => void;
  orderId: number;
}

export default function Technician_Repairing({
  appointment,
  setIsRepairing,
  orderId,
}: Props) {
  const [loadingPartId, setLoadingPartId] = useState<number | null>(null);
  const { mutateAsync: updatePartStatus } = useUpdatePartStatus();
  const notification = useNotification();
  const queryClient = useQueryClient();

  const [localParts, setLocalParts] = useState(appointment.parts);

  const { data: techDetail, isLoading, isFetching } = useGetAccount();

  if (isLoading || isFetching) {
    return <SpinnerComponent />;
  }

  const totalParts = localParts.filter(
    (part) => part.technicianId === techDetail?.data?.techId
  ).length;
  const completedParts = localParts.filter(
    (p) =>
      p.partStatus === "Done" && p.technicianId === techDetail?.data?.techId
  ).length;

  const progressPercentage =
    totalParts > 0 ? (completedParts / totalParts) * 100 : 0;

  const myParts = localParts.filter(
    (p) => p.technicianId === techDetail?.data?.techId
  );
  const otherParts = localParts.filter(
    (p) => p.technicianId !== techDetail?.data?.techId
  );

  const handleUpdatePartStatus = async (
    partId: number,
    isReplaced: boolean
  ) => {
    setLoadingPartId(partId);
    try {
      await updatePartStatus({
        orderId: orderId,
        partId: partId,
        isReplaced: isReplaced,
      });

      await queryClient.invalidateQueries({
        queryKey: ["TechnicianAppointments"],
      });

      setLocalParts((prev) =>
        prev.map((p) => (p.id === partId ? { ...p, partStatus: "Done" } : p))
      );
      notification.success({
        message: MSG_TITLE.PART_UPDATE,
        description: SUCCESS_MESSAGE.PART_UPDATE_SUCCESS,
        showProgress: true,
      });
    } catch (error) {
      notification.error({
        message: MSG_TITLE.PART_UPDATE,
        description:
          (error as Error).message ||
          ERROR_MESSAGE.FAILED_TO_UPDATE_PART_STATUS,
        showProgress: true,
      });
    } finally {
      setLoadingPartId(null);
    }
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <BackButton onClick={() => setIsRepairing(false)}>
            <ArrowLeft size={20} />
            Back
          </BackButton>
          <HeaderIcon>
            <Wrench size={32} />
          </HeaderIcon>
          <HeaderText>
            <Title>Repairing in Progress</Title>
            <Subtitle>
              Appointment #{appointment.id} - {appointment.customerName}
            </Subtitle>
          </HeaderText>
        </Header>

        <ProgressCard>
          <ProgressHeader>
            <ProgressTitle>My Overall Progress</ProgressTitle>
            <ProgressStats>
              {completedParts} / {totalParts} parts completed
            </ProgressStats>
          </ProgressHeader>
          <ProgressBarContainer>
            <ProgressBar $percentage={progressPercentage} />
          </ProgressBarContainer>
          <ProgressPercentage>
            {Math.round(progressPercentage)}%
          </ProgressPercentage>
        </ProgressCard>

        {myParts.length > 0 && (
          <Section>
            <SectionHeader>
              <SectionTitle>
                <User size={20} />
                My Parts ({myParts.length})
              </SectionTitle>
            </SectionHeader>
            <PartsGrid>
              {myParts.map((part) => (
                <PartCard key={part.id} $completed={part.partStatus === "Done"}>
                  <PartImage src={part.imageUrl} alt={part.name} />
                  <PartInfo>
                    <PartName>{part.name}</PartName>
                    <TechInfo>
                      <User size={14} />
                      {part.technicianName}
                    </TechInfo>
                    <PartDetails>
                      <DetailItem>
                        <DetailLabel>Quantity</DetailLabel>
                        <DetailValue>{part.quantity}</DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Status</DetailLabel>
                        <StatusBadge $status={part.partStatus}>
                          {part.partStatus}
                        </StatusBadge>
                      </DetailItem>
                    </PartDetails>
                  </PartInfo>

                  {part.partStatus === "Done" ? (
                    <CompletedBadge>
                      <CheckCircle size={20} />
                      Completed
                    </CompletedBadge>
                  ) : loadingPartId === part.id ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <ColorSpinner key={part.id} width="2em" height="2em" />
                    </div>
                  ) : (
                    <ActionButton
                      onClick={() => handleUpdatePartStatus(part.id, true)}
                    >
                      <CheckCircle size={18} />
                      Mark as Completed
                    </ActionButton>
                  )}
                </PartCard>
              ))}
            </PartsGrid>
          </Section>
        )}

        {otherParts.length > 0 && (
          <Section>
            <SectionHeader>
              <SectionTitle>
                <Lock size={20} />
                Other Technicians' Parts ({otherParts.length})
              </SectionTitle>
              <LockedHint>Read-only - managed by other technicians</LockedHint>
            </SectionHeader>
            <PartsGrid>
              {otherParts.map((part) => (
                <PartCard
                  key={part.id}
                  $completed={part.partStatus === "Done"}
                  $locked
                >
                  <LockOverlay>
                    <Lock size={24} opacity={0.5} />
                  </LockOverlay>
                  <PartImage src={part.imageUrl} alt={part.name} />
                  <PartInfo>
                    <PartName>{part.name}</PartName>
                    <TechInfo>
                      <User size={14} />
                      {part.technicianName}
                    </TechInfo>
                    <PartDetails>
                      <DetailItem>
                        <DetailLabel>Quantity</DetailLabel>
                        <DetailValue>{part.quantity}</DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Status</DetailLabel>
                        <StatusBadge $status={part.partStatus}>
                          {part.partStatus}
                        </StatusBadge>
                      </DetailItem>
                    </PartDetails>
                  </PartInfo>

                  {part.partStatus === "Done" ? (
                    <CompletedBadge>
                      <CheckCircle size={20} />
                      Completed
                    </CompletedBadge>
                  ) : (
                    <WaitingBadge>
                      <Clock size={18} />
                      In Progress
                    </WaitingBadge>
                  )}
                </PartCard>
              ))}
            </PartsGrid>
          </Section>
        )}
      </ContentWrapper>
    </PageContainer>
  );
}

import {
  ActionButton,
  CompletedBadge,
  ContentWrapper,
  DetailItem,
  DetailLabel,
  DetailValue,
  Header,
  HeaderIcon,
  HeaderText,
  LockOverlay,
  LockedHint,
  PageContainer,
  PartCard,
  PartDetails,
  PartImage,
  PartInfo,
  PartName,
  PartsGrid,
  ProgressBar,
  ProgressBarContainer,
  ProgressCard,
  ProgressHeader,
  ProgressPercentage,
  ProgressStats,
  ProgressTitle,
  Section,
  SectionHeader,
  SectionTitle,
  StatusBadge,
  Subtitle,
  TechInfo,
  Title,
  WaitingBadge,
} from "./styles/Technician_Repairing.styled";
import { useGetAccount } from "../../../services/authService";
import SpinnerComponent from "../../../components/SpinnerComponent";
