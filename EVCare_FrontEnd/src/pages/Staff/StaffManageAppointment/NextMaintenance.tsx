import React, { useState } from "react";
import {
  Calendar,
  Car,
  Phone,
  User,
  FileText,
  CheckCircle,
} from "lucide-react";
import type { AppointmentDetailModel } from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import type {
  TechnicianModel,
  TechnicianSkills,
} from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { useEnterRemindSchedule } from "../../../services/appointmentServiceApi";
import {
  ERROR_MESSAGE,
  MSG_TITLE,
  SUCCESS_MESSAGE,
} from "../../../constants/messages/Message";
import SuccessModal from "../../../components/StatusModal/SuccessModal";
import FailedModal from "../../../components/StatusModal/FailModal";
import { useQueryClient } from "@tanstack/react-query";
import TextWaitingEffect from "../StaffComponents/TextWaitingEffect";

interface NextMaintenanceProps {
  data: AppointmentDetailModel<TechnicianModel<TechnicianSkills>>;
  onConfirm?: (months: number | string) => void;
  onSkip?: () => void;
}

export default function NextMaintenance({ data }: NextMaintenanceProps) {
  const [reminderMonths, setReminderMonths] = useState<number | string>(3);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  //handle submit schedule
  const { mutateAsync: enterRemindSchedule, isPending } =
    useEnterRemindSchedule();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await enterRemindSchedule({
        id: data.vehicleId,
        reminderIntervalMonths: Number(reminderMonths),
      });

      setIsSuccess(true);
      setMessage(SUCCESS_MESSAGE.SCHEDULE_SUCCESSFULLY);
    } catch (error) {
      setIsError(true);
      setMessage(ERROR_MESSAGE.FAILED_TO_SCHEDULE_MAINTENANCE);
    }
  };

  const handleCloseModal = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["AppointmentDetail"],
    });
    setIsSuccess(false);
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
                    <InfoValue>{data.customerEmail}</InfoValue>
                  </InfoContent>
                </InfoRow>

                <InfoRow>
                  <IconWrapper>
                    <Car size={18} />
                  </IconWrapper>
                  <InfoContent>
                    <InfoLabel>Vehicle</InfoLabel>
                    <InfoValue>
                      {data.vehicleName} - {data.vehiclePlateNumber}
                    </InfoValue>
                  </InfoContent>
                </InfoRow>

                <InfoRow>
                  <IconWrapper>
                    <Calendar size={18} />
                  </IconWrapper>
                  <InfoContent>
                    <InfoLabel>Appointment Date</InfoLabel>
                    <InfoValue>
                      {formatDate(data.appointmentDate.toString())}
                    </InfoValue>
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
                    new Date(data.appointmentDate.toString()).setMonth(
                      new Date(data.appointmentDate.toString()).getMonth() +
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

            {isPending ? (
              <TextWaitingEffect text="Waiting for processing" />
            ) : (
              <ActionButtons>
                <ConfirmButton type="submit">
                  <CheckCircle size={20} />
                  Confirm & Schedule
                </ConfirmButton>
              </ActionButtons>
            )}
          </FormSection>
        </MainContent>
      </ContentWrapper>
      {isSuccess && (
        <SuccessModal
          header={MSG_TITLE.SCHEDULE}
          message={message}
          action={handleCloseModal}
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

import {
  PageContainer,
  ContentWrapper,
  Header,
  HeaderIcon,
  HeaderText,
  MainContent,
  DetailsSection,
  FormSection,
  SectionTitle,
  AppointmentCard,
  AppointmentHeader,
  AppointmentId,
  StatusBadge,
  InfoGroup,
  InfoRow,
  IconWrapper,
  InfoContent,
  InfoLabel,
  InfoValue,
  ServicesSection,
  ServicesLabel,
  ServicesList,
  ServiceTag,
  ReminderCard,
  ReminderTitle,
  QuickSelect,
  QuickButton,
  Divider,
  CustomInput,
  InputLabel,
  InputWrapper,
  StyledInput,
  InputSuffix,
  PreviewBox,
  PreviewLabel,
  PreviewDate,
  ActionButtons,
  ConfirmButton,
} from "./styles/NextMaintenance.styled";
