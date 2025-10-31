import React, { useState } from "react";
import styled from "styled-components";
import {
  Calendar,
  Car,
  Phone,
  User,
  FileText,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import type { StaffAppointmentsDto } from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import type {
  TechnicianModel,
  TechnicianSkills,
} from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { useAppDispatch } from "../../../states/store";
import { setStep } from "../../../states/appointmentSlice";
import {
  useEnterRemindSchedule,
  useGetAppointmentById,
} from "../../../services/appointmentServiceApi";
import {
  ERROR_MESSAGE,
  MSG_TITLE,
  SUCCESS_MESSAGE,
} from "../../../constants/messages/Message";
import SuccessModal from "../../../components/StatusModal/SuccessModal";
import FailedModal from "../../../components/StatusModal/FailModal";

interface NextMaintenanceProps {
  data: StaffAppointmentsDto<TechnicianModel<TechnicianSkills>>;
  onConfirm?: (months: number | string) => void;
  onSkip?: () => void;
  currentStep: number;
}

export default function NextMaintenance({
  data,
  currentStep,
}: NextMaintenanceProps) {
  const [reminderMonths, setReminderMonths] = useState<number | string>(3);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();

  const { data: appointmentDetail } = useGetAppointmentById(data.id);

  const onSkip = () => {
    dispatch(setStep({ id: data.id, step: currentStep + 1 }));
  };

  //handle submit schedule
  const { mutateAsync: enterRemindSchedule } = useEnterRemindSchedule();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await enterRemindSchedule({
        id: appointmentDetail?.data?.vehicleId,
        reminderIntervalMonths: Number(reminderMonths),
      });

      setIsSuccess(true);
      setMessage(SUCCESS_MESSAGE.SCHEDULE_SUCCESSFULLY);
    } catch (error) {
      setIsError(true);
      setMessage(ERROR_MESSAGE.FAILED_TO_SCHEDULE_MAINTENANCE);
    }
  };

  const handleChangeStep = () => {
    dispatch(setStep({ id: data.id, step: currentStep + 1 }));
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const quickSelectMonths = [1, 3, 6, 12];

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <HeaderIcon>
            <Calendar size={36} />
          </HeaderIcon>
          <HeaderText>
            <h1>Schedule Next Maintenance</h1>
            <p>Set up automatic reminder for the next service appointment</p>
          </HeaderText>
        </Header>

        <MainContent>
          <DetailsSection>
            <SectionTitle>Appointment Details</SectionTitle>

            <AppointmentCard>
              <AppointmentHeader>
                <AppointmentId>#{data.id}</AppointmentId>
                <StatusBadge $status={data.status}>{data.status}</StatusBadge>
              </AppointmentHeader>

              <InfoGroup>
                <InfoRow>
                  <IconWrapper>
                    <User size={18} />
                  </IconWrapper>
                  <InfoContent>
                    <InfoLabel>Customer Name</InfoLabel>
                    <InfoValue>{data.customerName}</InfoValue>
                  </InfoContent>
                </InfoRow>

                <InfoRow>
                  <IconWrapper>
                    <Phone size={18} />
                  </IconWrapper>
                  <InfoContent>
                    <InfoLabel>Phone Number</InfoLabel>
                    <InfoValue>{data.phoneNumber}</InfoValue>
                  </InfoContent>
                </InfoRow>
                <InfoRow>
                  <IconWrapper>
                    <Phone size={18} />
                  </IconWrapper>
                  <InfoContent>
                    <InfoLabel>Email</InfoLabel>
                    <InfoValue>
                      {appointmentDetail?.data?.customerEmail}
                    </InfoValue>
                  </InfoContent>
                </InfoRow>

                <InfoRow>
                  <IconWrapper>
                    <Car size={18} />
                  </IconWrapper>
                  <InfoContent>
                    <InfoLabel>Vehicle</InfoLabel>
                    <InfoValue>
                      {data.vehicleModel} - {data.licensePlate}
                    </InfoValue>
                  </InfoContent>
                </InfoRow>

                <InfoRow>
                  <IconWrapper>
                    <Calendar size={18} />
                  </IconWrapper>
                  <InfoContent>
                    <InfoLabel>Appointment Date</InfoLabel>
                    <InfoValue>{formatDate(data.appointmentDate)}</InfoValue>
                  </InfoContent>
                </InfoRow>

                {data.note && (
                  <InfoRow style={{ alignItems: "flex-start" }}>
                    <IconWrapper>
                      <FileText size={18} />
                    </IconWrapper>
                    <InfoContent>
                      <InfoLabel>Notes</InfoLabel>
                      <InfoValue>{data.note}</InfoValue>
                    </InfoContent>
                  </InfoRow>
                )}
              </InfoGroup>

              {data.services && data.services.length > 0 && (
                <ServicesSection>
                  <ServicesLabel>Services Performed</ServicesLabel>
                  <ServicesList>
                    {data.services.map((service, index) => (
                      <ServiceTag key={index}>{service.name}</ServiceTag>
                    ))}
                  </ServicesList>
                </ServicesSection>
              )}
            </AppointmentCard>
          </DetailsSection>

          <FormSection onSubmit={handleSubmit}>
            <SectionTitle>Set Reminder Interval</SectionTitle>

            <ReminderCard>
              <ReminderTitle>When should we remind the customer?</ReminderTitle>

              <QuickSelect>
                {quickSelectMonths.map((months) => (
                  <QuickButton
                    key={months}
                    type="button"
                    $selected={reminderMonths === months}
                    onClick={() => setReminderMonths(months)}
                  >
                    {months} {months === 1 ? "Month" : "Months"}
                  </QuickButton>
                ))}
              </QuickSelect>

              <Divider>or</Divider>

              <CustomInput>
                <InputLabel>Custom Interval (Months)</InputLabel>
                <InputWrapper>
                  <StyledInput
                    type="number"
                    min="1"
                    max="36"
                    value={reminderMonths}
                    onChange={(e) => {
                      const value = e.target.value;
                      setReminderMonths(value === "" ? "" : Number(value));
                    }}
                    onBlur={() => {
                      if (
                        reminderMonths === "" ||
                        isNaN(Number(reminderMonths))
                      ) {
                        setReminderMonths(0);
                      }
                    }}
                    placeholder="Enter months"
                    required
                  />
                  <InputSuffix>months</InputSuffix>
                </InputWrapper>
              </CustomInput>

              <PreviewBox>
                <PreviewLabel>Next Reminder Date</PreviewLabel>
                <PreviewDate>
                  {new Date(
                    new Date(data.appointmentDate).setMonth(
                      new Date(data.appointmentDate).getMonth() +
                        Number(reminderMonths)
                    )
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </PreviewDate>
              </PreviewBox>
            </ReminderCard>

            <ActionButtons>
              <SkipButton type="button" onClick={onSkip}>
                Skip This Step
                <ArrowRight size={20} />
              </SkipButton>
              <ConfirmButton type="submit">
                <CheckCircle size={20} />
                Confirm & Schedule
              </ConfirmButton>
            </ActionButtons>
          </FormSection>
        </MainContent>
      </ContentWrapper>
      {isSuccess && (
        <SuccessModal
          header={MSG_TITLE.SCHEDULE}
          message={message}
          action={handleChangeStep}
        />
      )}
      {isError && (
        <FailedModal
          header={MSG_TITLE.SCHEDULE}
          message={message}
          action={() => setIsError(false)}
        />
      )}
    </PageContainer>
  );
}

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  padding: 20px 20px;
  font-family: "Outfit", sans-serif;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  background: white;
  padding: 24px 32px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeaderIcon = styled.div`
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #00ad4e 0%, #00c853 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.3);
`;

const HeaderText = styled.div`
  flex: 1;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #00ad4e;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 15px;
    color: #666;
    margin: 0;
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const DetailsSection = styled.div``;

const FormSection = styled.form``;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0 0 16px 0;
`;

const AppointmentCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const AppointmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
`;

const AppointmentId = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #00ad4e;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  background: ${(props) => {
    switch (props.$status.toLowerCase()) {
      case "completed":
        return "#e8f5e9";
      case "in progress":
        return "#fff3e0";
      case "pending":
        return "#e3f2fd";
      default:
        return "#f5f5f5";
    }
  }};
  color: ${(props) => {
    switch (props.$status.toLowerCase()) {
      case "completed":
        return "#2e7d32";
      case "in progress":
        return "#e65100";
      case "pending":
        return "#1565c0";
      default:
        return "#616161";
    }
  }};
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  background: #f1f8f4;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00ad4e;
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 2px;
`;

const InfoValue = styled.div`
  font-size: 15px;
  color: #333;
  font-weight: 600;
`;

const ServicesSection = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid #f0f0f0;
  overflow-y: auto;
  height: 150px;
`;

const ServicesLabel = styled.div`
  font-size: 13px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 12px;
`;

const ServicesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ServiceTag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #e8f5e9;
  color: #00ad4e;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;

  svg {
    flex-shrink: 0;
  }
`;

const ReminderCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const ReminderTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
`;

const QuickSelect = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
`;

const QuickButton = styled.button<{ $selected: boolean }>`
  padding: 16px;
  border: 2px solid ${(props) => (props.$selected ? "#00ad4e" : "#e0e0e0")};
  background: ${(props) => (props.$selected ? "#e8f5e9" : "white")};
  color: ${(props) => (props.$selected ? "#00ad4e" : "#666")};
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ad4e;
    background: #f1f8f4;
    transform: translateY(-2px);
  }
`;

const Divider = styled.div`
  text-align: center;
  color: #999;
  font-size: 13px;
  margin: 20px 0;
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background: #e0e0e0;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
`;

const CustomInput = styled.div`
  margin-bottom: 24px;
`;

const InputLabel = styled.div`
  font-size: 13px;
  color: #666;
  font-weight: 600;
  margin-bottom: 8px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 14px 80px 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  color: #333;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ad4e;
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.1);
  }
`;

const InputSuffix = styled.div`
  position: absolute;
  right: 16px;
  font-size: 14px;
  color: #999;
  font-weight: 600;
  pointer-events: none;
`;

const PreviewBox = styled.div`
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%);
  border: 2px solid #c8e6c9;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
`;

const PreviewLabel = styled.div`
  font-size: 12px;
  color: #00ad4e;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const PreviewDate = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #00ad4e;
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 24px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SkipButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  border: 2px solid #e0e0e0;
  background: white;
  color: #666;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ad4e;
    color: #00ad4e;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ConfirmButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  border: none;
  background: linear-gradient(135deg, #00ad4e 0%, #00c853 100%);
  color: white;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 173, 78, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;
