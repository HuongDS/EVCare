import { useState, useEffect } from "react";
import { Package, Clock, Wrench, CheckCircle, AlertCircle } from "lucide-react";
import type { AppointmentDetailModel } from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import type {
  TechnicianModel,
  TechnicianSkills,
} from "../../../models/AppointmentsModel/Technician_Appointments_Model";

interface Props {
  data: AppointmentDetailModel<TechnicianModel<TechnicianSkills>>;
}

export default function WaitingAddingPart({ data }: Props) {
  const [dots, setDots] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useStaffHubOrderChange<any>(async (type) => {
    if (type === "OrderConfirmed") {
      await queryClient.invalidateQueries({ queryKey: ["AppointmentDetail"] });
    }
  });
  return (
    <PageContainer>
      <ContentCard>
        <AnimatedIcon>
          <Package size={60} color="white" />
        </AnimatedIcon>

        <Title>Adding Parts in Progress</Title>

        <Subtitle>
          Technicians are currently selecting and adding parts for this service.
          <br />
          Please wait while they complete this process{dots}
        </Subtitle>

        <StatusSection>
          <StatusCard>
            <StatusIcon>
              <Clock size={24} />
            </StatusIcon>
            <StatusInfo>
              <StatusLabel>Appointment ID</StatusLabel>
              <StatusValue>#{data.id}</StatusValue>
            </StatusInfo>
          </StatusCard>

          <StatusCard>
            <StatusIcon $color="#00ad4e">
              <Wrench size={24} />
            </StatusIcon>
            <StatusInfo>
              <StatusLabel>Status</StatusLabel>
              <StatusValue>Adding Parts</StatusValue>
            </StatusInfo>
          </StatusCard>
        </StatusSection>

        {data.technicians.length > 0 && (
          <TechnicianSection>
            <TechnicianTitle>
              <AlertCircle size={18} />
              Working Technicians
            </TechnicianTitle>
            <TechnicianList>
              {data.technicians.map((tech) => (
                <TechnicianCard key={tech.id}>
                  <TechAvatar
                    src={
                      tech.avatar ||
                      `https://ui-avatars.com/api/?name=${tech.fullName}&background=00ad4e&color=fff`
                    }
                    alt={tech.fullName}
                  />
                  <TechName>{tech.fullName}</TechName>
                  <TechStatus>
                    <PulsingDot />
                    {tech.status}
                  </TechStatus>
                </TechnicianCard>
              ))}
            </TechnicianList>
          </TechnicianSection>
        )}

        <ProcessSteps>
          <StepItem $active={true} $completed={true}>
            <StepIcon>
              <CheckCircle size={20} />
            </StepIcon>
            <StepText>
              <StepTitle>Diagnosis Complete</StepTitle>
              <StepDesc>Issue identified</StepDesc>
            </StepText>
          </StepItem>

          <StepConnector $active={true} />

          <StepItem $active={true} $completed={false}>
            <StepIcon $pulse={true}>
              <Package size={20} />
            </StepIcon>
            <StepText>
              <StepTitle>Adding Parts</StepTitle>
              <StepDesc>In progress...</StepDesc>
            </StepText>
          </StepItem>

          <StepConnector $active={false} />

          <StepItem $active={false} $completed={false}>
            <StepIcon>
              <CheckCircle size={20} />
            </StepIcon>
            <StepText>
              <StepTitle>Staff Confirmation</StepTitle>
              <StepDesc>Waiting</StepDesc>
            </StepText>
          </StepItem>
        </ProcessSteps>

        <InfoBox>
          <InfoIcon>
            <AlertCircle size={20} />
          </InfoIcon>
          <InfoText>
            <strong>What's happening?</strong>
            <br />
            Technicians are reviewing the vehicle and adding necessary parts to
            the order. Once they complete this step, staff will review and
            confirm the parts list.
          </InfoText>
        </InfoBox>

        <FooterNote>
          This page will automatically refresh when the process is complete
        </FooterNote>
      </ContentCard>
    </PageContainer>
  );
}

import {
  PageContainer,
  ContentCard,
  AnimatedIcon,
  Title,
  Subtitle,
  StatusSection,
  StatusCard,
  StatusIcon,
  StatusInfo,
  StatusLabel,
  StatusValue,
  TechnicianSection,
  TechnicianTitle,
  TechnicianList,
  TechnicianCard,
  TechAvatar,
  TechName,
  TechStatus,
  PulsingDot,
  ProcessSteps,
  StepItem,
  StepIcon,
  StepText,
  StepTitle,
  StepDesc,
  StepConnector,
  InfoBox,
  InfoIcon,
  InfoText,
  FooterNote,
} from "./styles/WaitingAddingPart.styled";
import { useStaffHubOrderChange } from "../../../hooks/useStaffHub";
import { useQueryClient } from "@tanstack/react-query";
