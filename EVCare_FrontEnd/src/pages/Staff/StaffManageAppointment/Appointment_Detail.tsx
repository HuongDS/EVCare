import {
  Calendar,
  User,
  Phone,
  Car,
  Wrench,
  FileText,
  AlertCircle,
} from "lucide-react";
import Zoom from "react-medium-image-zoom";
import type { StaffAppointmentsDto } from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import type {
  TechnicianModel,
  TechnicianSkills,
} from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import ErrorPage from "../StaffComponents/Error";
import ConfirmModal from "../../../components/StatusModal/ConfirmModal";
import { useState } from "react";
import { useChangeAppointmentStatus } from "../../../services/appointmentServiceApi";
import SuccessModal from "../../../components/StatusModal/SuccessModal";
import FailedModal from "../../../components/StatusModal/FailModal";
import ColorSpinner from "../StaffComponents/ColorSpinner";
import { useQueryClient } from "@tanstack/react-query";

interface AppointmentDetailProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  appointment:
    | StaffAppointmentsDto<TechnicianModel<TechnicianSkills>>
    | undefined;
}

export default function Appointment_Detail({
  isOpen,
  setIsOpen,
  appointment,
}: AppointmentDetailProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const { mutateAsync: cancelAppointment, isPending } =
    useChangeAppointmentStatus();
  const queryClient = useQueryClient();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return { bg: "#fff3e0", color: "#e65100", border: "#ffcc80" };
      case "CheckedIn":
        return { bg: "#fff3e0", color: "#e65100", border: "#ffcc80" };
      case "InProgress":
        return { bg: "#e3f2fd", color: "#1976d2", border: "#90caf9" };
      case "Done":
        return { bg: "#d7ffe9", color: "#00ad4e", border: "#03b800" };
      case "Canceled":
        return { bg: "#ffebee", color: "#c62828", border: "#ef9a9a" };
      case "Confirmed":
        return { bg: "#e3f2fd", color: "#1976d2", border: "#90caf9" };
      case "ReadyForPickup":
        return { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" };
      default:
        return { bg: "#f5f5f5", color: "#616161", border: "#e0e0e0" };
    }
  };

  if (!appointment) {
    return <ErrorPage />;
  }

  const statusStyle = getStatusColor(appointment?.status);

  const handleCancelAppointment = async () => {
    try {
      await cancelAppointment({
        appointmentId: appointment.id,
        status: "Canceled",
      });
      queryClient.invalidateQueries({
        queryKey: ["Staff Appointments"],
      });
      setShowSuccessModal(true);
    } catch (error) {
      setShowErrorModal(true);
    }
  };

  return (
    <ModalStyled
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      closeIcon={false}
      footer={false}
    >
      <PageContainer>
        <ContentWrapper>
          <HeaderCard>
            <HeaderTop>
              <LeftSection>
                <AppointmentId>AID: #{appointment?.id}</AppointmentId>
                {appointment.status !== "Canceled" && appointment.orderId ? (
                  <AppointmentId>
                    OrderID: #{appointment?.orderId}
                  </AppointmentId>
                ) : (
                  <AppointmentId>OrderID: N/A</AppointmentId>
                )}
                <StatusBadge
                  style={{
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    borderColor: statusStyle.border,
                  }}
                >
                  {appointment.status}
                </StatusBadge>
              </LeftSection>
              <DateSection>
                <Calendar size={18} />
                {new Date(appointment?.appointmentDate).toLocaleDateString(
                  "vi-VN",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </DateSection>
            </HeaderTop>
          </HeaderCard>

          <ContentGrid>
            <LeftColumn>
              <Card>
                <SectionTitle>Vehicle Images</SectionTitle>
                <ImageGrid>
                  {appointment?.appointmentImages.map((img, idx) => (
                    <Zoom key={idx}>
                      <VehicleImage src={img} alt={`Vehicle ${idx + 1}`} />
                    </Zoom>
                  ))}
                </ImageGrid>
              </Card>

              <Card>
                <SectionTitle>
                  <User size={18} />
                  Customer Information
                </SectionTitle>
                <InfoGrid>
                  <InfoItem>
                    <IconLabel>
                      <User size={14} />
                      Full Name
                    </IconLabel>
                    <InfoValue>{appointment?.customerName}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <IconLabel>
                      <Phone size={14} />
                      Phone Number
                    </IconLabel>
                    <InfoValue>{appointment?.phoneNumber}</InfoValue>
                  </InfoItem>
                </InfoGrid>
                <hr />
                <InfoGrid>
                  <InfoItem>
                    <IconLabel>
                      <Car size={14} />
                      Vehicle
                    </IconLabel>
                    <InfoValue>{appointment?.vehicleModel}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <IconLabel>License Plate</IconLabel>
                    <InfoValue>
                      {formatPlateNumber(appointment?.licensePlate)}
                    </InfoValue>
                  </InfoItem>
                </InfoGrid>
              </Card>
            </LeftColumn>

            <RightColumn>
              <Card>
                <SectionTitle>
                  <Wrench size={18} />
                  Requested Services
                </SectionTitle>
                <ServicesList>
                  {appointment?.services.map((service, idx) => (
                    <ServiceItem key={idx}>
                      <ServiceLeft>
                        <ServiceName>{service.name}</ServiceName>
                      </ServiceLeft>
                    </ServiceItem>
                  ))}
                </ServicesList>
              </Card>

              <Card>
                <SectionTitle>
                  <FileText size={18} />
                  Notes
                </SectionTitle>
                <NotesContent>{appointment?.note}</NotesContent>
              </Card>
            </RightColumn>
          </ContentGrid>

          <ActionsCard>
            {isPending ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <ColorSpinner width="3em" height="3em" />
              </div>
            ) : (
              <ButtonGroup>
                <BackButton onClick={() => setIsOpen(false)}>Back</BackButton>
                {appointment?.status !== "InProgress" &&
                  appointment?.status !== "AddingPart" &&
                  appointment?.status !== "ReadyForPickup" &&
                  appointment?.status !== "Canceled" &&
                  appointment?.status !== "Done" && (
                    <CancelButton onClick={() => setShowCancelModal(true)}>
                      <AlertCircle size={16} />
                      Cancel Appointment
                    </CancelButton>
                  )}
              </ButtonGroup>
            )}
          </ActionsCard>
        </ContentWrapper>
        {showCancelModal && (
          <ConfirmModal
            open={showCancelModal}
            onClose={() => setShowCancelModal(false)}
            onConfirm={handleCancelAppointment}
            message="Do you want to cancel this appointment?"
          />
        )}

        {showSuccessModal && (
          <SuccessModal
            header="Appointment Deletion"
            message="Appointment is deleted successfully"
            action={() => setIsOpen(false)}
          />
        )}

        {showErrorModal && (
          <FailedModal
            header="Appointment Deletion"
            message="Failed to delete the appointment"
            action={() => setShowErrorModal(false)}
          />
        )}
      </PageContainer>
    </ModalStyled>
  );
}

import {
  ActionsCard,
  AppointmentId,
  BackButton,
  ButtonGroup,
  CancelButton,
  Card,
  ContentGrid,
  ContentWrapper,
  DateSection,
  HeaderCard,
  HeaderTop,
  IconLabel,
  ImageGrid,
  InfoGrid,
  InfoItem,
  InfoValue,
  LeftColumn,
  LeftSection,
  ModalStyled,
  NotesContent,
  PageContainer,
  RightColumn,
  SectionTitle,
  ServiceItem,
  ServiceLeft,
  ServiceName,
  ServicesList,
  StatusBadge,
  VehicleImage,
} from "./styles/Appointment_Detail.styled";
import { formatPlateNumber } from "../../../utils/formatPlateNumber";
