// import styled from "styled-components";
import type { AppointmentDetailModel } from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import { useCreateNewOrder } from "../../../services/orderServiceApi";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import type {
  TechnicianModel,
  TechnicianSkills,
} from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { useQueryClient } from "@tanstack/react-query";
import SpinnerComponent from "../../../components/SpinnerComponent";
import { useState } from "react";
import SuccessModal from "../../../components/StatusModal/SuccessModal";
import FailedModal from "../../../components/StatusModal/FailModal";
import ConfirmModal from "../../../components/StatusModal/ConfirmModal";
import { APPOINTMENT_MESSAGE } from "../../../constants/messages/Message";
import { useChangeAppointmentStatus } from "../../../services/appointmentServiceApi";
import { User, Car, Phone, FileText, CheckCircle, XCircle, Image as ImageIcon, Wrench } from "lucide-react";
import {
  ActionButtons,
  AppointmentId,
  CancelButton,
  Card,
  CardTitle,
  CheckInButton,
  ContentWrapper,
  Header,
  HeaderIcon,
  HeaderText,
  ImageGrid,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  MainContent,
  NotesBox,
  PageContainer,
  ServiceItem,
  ServiceName,
  ServiceNumber,
  ServicesList,
  SpinnerWrapper,
  VehicleImage,
} from "./styles/Appointment_CheckIn.styled";

interface Props {
  data: AppointmentDetailModel<TechnicianModel<TechnicianSkills>>;
  close: () => void;
}

export default function Appointment_CheckIn({ data, close }: Props) {
  const [isCheckInSuccessOpen, setIsCheckInSuccessOpen] = useState(false);
  const [isCancelSuccessOpen, setIsCancelSuccessOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [title, setTitle] = useState("Check In");

  const { mutateAsync: newOrder } = useCreateNewOrder();
  const { mutateAsync: appointmentStatus, isPending } = useChangeAppointmentStatus();
  const queryClient = useQueryClient();

  const handleChangeAppointmentStatus = async (status: string) => {
    const changeStatus = {
      appointmentId: data.id,
      status: status,
    };
    try {
      await appointmentStatus(changeStatus);
      return true;
    } catch (error) {
      setTitle("Check In Failed");
      setModalMessage((error as Error).message || APPOINTMENT_MESSAGE.APPOINTMENT_CHECKIN_FAIL);
      setIsErrorModalOpen(true);
      return false;
    }
  };

  const handleCreateOrder = async () => {
    const createNewOrderParams = {
      appointmentID: data.id,
      created_At: new Date().toISOString(),
    };
    try {
      const order = await newOrder(createNewOrderParams);

      if (!order.data?.orderID) {
        setTitle("Create Order Failed");
        setModalMessage("Order ID is missing.");
        setIsErrorModalOpen(true);
        return;
      }

      // success flow
      setModalMessage(APPOINTMENT_MESSAGE.APPOINTMENT_CHECKIN_SUCCESS);
      setIsCheckInSuccessOpen(true);
      await queryClient.invalidateQueries({ queryKey: ["AppointmentDetail"] });
    } catch (error) {
      setTitle("Create Order Failed");
      setModalMessage(String(error));
      setIsErrorModalOpen(true);
    }
  };

  const handleCheckIn = async (status: "CheckedIn") => {
    const isStatusChanged = await handleChangeAppointmentStatus(status);
    if (isStatusChanged) {
      await handleCreateOrder();
    }
  };

  const handleCancel = async (status: "Canceled") => {
    const changeStatus = {
      appointmentId: data.id,
      status: status,
    };

    try {
      const response = await appointmentStatus(changeStatus);

      if (response.statusCode !== 200) {
        setModalMessage(response.message || APPOINTMENT_MESSAGE.APPOINTMENT_CANCEL_FAIL);
        setIsErrorModalOpen(true);
        return;
      }
      setModalMessage(APPOINTMENT_MESSAGE.APPOINTMENT_CANCEL_SUCCESS);
      setIsCancelSuccessOpen(true);
      await queryClient.invalidateQueries({ queryKey: ["Staff Appointments"] });
    } catch (error) {
      setTitle("Cancellation Failed");
      setModalMessage((error as Error).message || APPOINTMENT_MESSAGE.APPOINTMENT_CANCEL_FAIL);
      setIsErrorModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsErrorModalOpen(false);
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <HeaderIcon>
            <CheckCircle size={36} />
          </HeaderIcon>
          <HeaderText>
            <h1>Check-In Appointment</h1>
            <AppointmentId>Appointment #{data.id}</AppointmentId>
          </HeaderText>
        </Header>

        <MainContent>
          <Card>
            <CardTitle>
              <User size={20} />
              Customer Information
            </CardTitle>

            <InfoGrid>
              <InfoItem>
                <InfoLabel>Customer Name</InfoLabel>
                <InfoValue>{data.customerName}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>
                  <Phone size={14} /> Phone Number
                </InfoLabel>
                <InfoValue>{data.phoneNumber}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>
                  <Car size={14} /> Vehicle Model
                </InfoLabel>
                <InfoValue>{data.vehicleName}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>License Plate</InfoLabel>
                <InfoValue>{data.vehiclePlateNumber}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </Card>

          <Card>
            <CardTitle>
              <Wrench size={20} />
              Services Requested
            </CardTitle>

            <ServicesList style={{ overflowX: "hidden" }}>
              {data.services.map((service, index) => (
                <ServiceItem key={index}>
                  <ServiceNumber>{index + 1}</ServiceNumber>
                  <ServiceName>{service.name}</ServiceName>
                </ServiceItem>
              ))}
            </ServicesList>
          </Card>

          {data?.imagesUrls && data.imagesUrls.length > 0 && (
            <Card>
              <CardTitle>
                <ImageIcon size={20} />
                Vehicle Images
              </CardTitle>

              <ImageGrid>
                {data.imagesUrls.map((img, i) => (
                  <Zoom key={i}>
                    <VehicleImage src={img} alt={`Vehicle ${i + 1}`} />
                  </Zoom>
                ))}
              </ImageGrid>
            </Card>
          )}

          {data.note && (
            <Card>
              <CardTitle>
                <FileText size={20} />
                Customer Notes
              </CardTitle>

              <NotesBox>{data.note}</NotesBox>
            </Card>
          )}
        </MainContent>

        <ActionButtons>
          {isPending ? (
            <SpinnerWrapper>
              <SpinnerComponent />
            </SpinnerWrapper>
          ) : (
            <>
              <CancelButton onClick={() => setConfirm(true)}>
                <XCircle size={20} />
                Cancel Appointment
              </CancelButton>
              <CheckInButton onClick={() => handleCheckIn("CheckedIn")}>
                <CheckCircle size={20} />
                Confirm Check-In
              </CheckInButton>
            </>
          )}
        </ActionButtons>
      </ContentWrapper>

      {isCheckInSuccessOpen && (
        <SuccessModal header="Check In" message={modalMessage} action={() => setIsCheckInSuccessOpen(false)} />
      )}
      {isCancelSuccessOpen && <SuccessModal header="Appointment Canceled" message={modalMessage} action={close} />}
      {isErrorModalOpen && <FailedModal header={title} message={modalMessage} action={handleCloseModal} />}
      {confirm && (
        <ConfirmModal
          onClose={() => setConfirm(false)}
          onConfirm={() => handleCancel("Canceled")}
          open={confirm}
          message="Do you want to cancel this appointment?"
        />
      )}
    </PageContainer>
  );
}
