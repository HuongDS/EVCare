import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
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

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

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
                    Active
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

        <LoadingBar>
          <LoadingFill />
        </LoadingBar>

        <FooterNote>
          This page will automatically refresh when the process is complete
        </FooterNote>
      </ContentCard>
    </PageContainer>
  );
}

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const dotPulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: "Outfit", sans-serif;
`;

const ContentCard = styled.div`
  max-width: 800px;
  width: 100%;
  background: white;
  border-radius: 24px;
  padding: 48px 40px;
  box-shadow: 0 20px 60px rgba(0, 173, 78, 0.3);
  text-align: center;

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const AnimatedIcon = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
  background: linear-gradient(135deg, #00ad4e 0%, #00c853 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 2s ease-in-out infinite;
  box-shadow: 0 10px 30px rgba(0, 173, 78, 0.4);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    border: 3px solid #00ad4e;
    opacity: 0.3;
    animation: ${spin} 3s linear infinite;
  }
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #00ad4e;
  margin: 0 0 16px 0;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0 0 40px 0;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 32px;
  }
`;

const StatusSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatusCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8fdf9;
  border: 2px solid #e8f5e9;
  border-radius: 12px;
  text-align: left;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ad4e;
    box-shadow: 0 4px 12px rgba(0, 173, 78, 0.15);
  }
`;

const StatusIcon = styled.div<{ $color?: string }>`
  width: 48px;
  height: 48px;
  background: ${(props) => props.$color || "#00ad4e"};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const StatusInfo = styled.div`
  flex: 1;
`;

const StatusLabel = styled.div`
  font-size: 12px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const StatusValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #333;
`;

const TechnicianSection = styled.div`
  background: #f8fdf9;
  border: 2px solid #e8f5e9;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
`;

const TechnicianTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #00ad4e;
  text-transform: uppercase;
  margin-bottom: 20px;
`;

const TechnicianList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const TechnicianCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: white;
  border: 2px solid #e8f5e9;
  border-radius: 12px;
  min-width: 120px;
`;

const TechAvatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid #00ad4e;
  object-fit: cover;
`;

const TechName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const TechStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #00ad4e;
  font-weight: 600;
  margin-top: auto;
`;

const PulsingDot = styled.div`
  width: 8px;
  height: 8px;
  background: #00ad4e;
  border-radius: 50%;
  animation: ${dotPulse} 2s ease-in-out infinite;
`;

const ProcessSteps = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  padding: 24px;
  background: #f8fdf9;
  border-radius: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const StepItem = styled.div<{ $active: boolean; $completed: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: ${(props) => (props.$active ? 1 : 0.4)};

  @media (max-width: 768px) {
    flex-direction: row;
    width: 100%;
  }
`;

const StepIcon = styled.div<{ $pulse?: boolean }>`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #00ad4e 0%, #00c853 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  animation: ${(props) => (props.$pulse ? pulse : "none")} 2s ease-in-out
    infinite;
`;

const StepText = styled.div`
  text-align: center;

  @media (max-width: 768px) {
    text-align: left;
    flex: 1;
  }
`;

const StepTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #333;
`;

const StepDesc = styled.div`
  font-size: 11px;
  color: #666;
  margin-top: 2px;
`;

const StepConnector = styled.div<{ $active: boolean }>`
  width: 60px;
  height: 2px;
  background: ${(props) => (props.$active ? "#00ad4e" : "#e0e0e0")};
  margin: 0 16px;

  @media (max-width: 768px) {
    width: 2px;
    height: 40px;
    margin: 0;
  }
`;

const InfoBox = styled.div`
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #fff3e0;
  border: 2px solid #ffcc80;
  border-radius: 12px;
  text-align: left;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const InfoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #ff9800;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const InfoText = styled.div`
  font-size: 14px;
  color: #666;
  line-height: 1.6;

  strong {
    color: #333;
    display: block;
    margin-bottom: 4px;
  }
`;

const LoadingBar = styled.div`
  height: 6px;
  background: #e8f5e9;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 173, 78, 0.3),
      transparent
    );
    animation: ${shimmer} 2s infinite;
  }
`;

const LoadingFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #00ad4e 0%, #00c853 100%);
  border-radius: 10px;
  width: 60%;
  transition: width 0.3s ease;
`;

const FooterNote = styled.p`
  font-size: 13px;
  color: #999;
  font-style: italic;
  margin: 0;
`;
