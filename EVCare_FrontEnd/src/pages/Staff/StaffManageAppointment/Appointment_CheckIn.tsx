import styled from "styled-components";
import type { StaffAppointmentsDto } from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import { useAppDispatch } from "../../../states/store";
import { setStep } from "../../../states/appointmentSlice";
import { CreateNewOrder } from "../../../services/orderServiceApi";
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
import {
  User,
  Car,
  Phone,
  FileText,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Wrench,
} from "lucide-react";

interface Props {
  data: StaffAppointmentsDto<TechnicianModel<TechnicianSkills>>;
  currentStep: number;
  close: () => void;
}

export default function Appointment_CheckIn({
  data,
  currentStep,
  close,
}: Props) {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [title, setTitle] = useState("Check In");
  const dispatch = useAppDispatch();
  const { mutateAsync: newOrder } = CreateNewOrder();
  const { mutateAsync: appointmentStatus, isPending } =
    useChangeAppointmentStatus();
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
      setModalMessage(APPOINTMENT_MESSAGE.APPOINTMENT_CHECKIN_FAIL);
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

      if (order.data?.orderID !== null) {
        data.orderId = order.data?.orderID || 0;
        setTitle("Check In");
        setModalMessage(APPOINTMENT_MESSAGE.APPOINTMENT_CHECKIN_SUCCESS);
        setIsSuccessModalOpen(true);
        await queryClient.invalidateQueries({
          queryKey: ["Staff Appointments"],
        });
      }
    } catch (error) {
      setTitle("Check In");
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
    const isStatusChanged = await handleChangeAppointmentStatus(status);
    setTitle("Appointment Cancellation");

    if (isStatusChanged) {
      setModalMessage(APPOINTMENT_MESSAGE.APPOINTMENT_CANCEL_SUCCESS);
      setIsSuccessModalOpen(true);
      await queryClient.invalidateQueries({
        queryKey: ["Staff Appointments"],
      });
      setTimeout(() => {
        close();
      }, 2000);
    } else {
      setModalMessage(APPOINTMENT_MESSAGE.APPOINTMENT_CANCEL_FAIL);
      setIsErrorModalOpen(true);
    }
  };

  const handleChangeSteps = () => {
    dispatch(setStep({ id: data.id, step: currentStep + 1 }));
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
                <InfoValue>{data.phoneNumber ?? "N/A"}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>
                  <Car size={14} /> Vehicle Model
                </InfoLabel>
                <InfoValue>{data.vehicleModel}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>License Plate</InfoLabel>
                <InfoValue>{data.licensePlate}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </Card>

          <Card>
            <CardTitle>
              <Wrench size={20} />
              Services Requested
            </CardTitle>

            <ServicesList>
              {data.services.map((service, index) => (
                <ServiceItem key={index}>
                  <ServiceNumber>{index + 1}</ServiceNumber>
                  <ServiceName>{service.name}</ServiceName>
                </ServiceItem>
              ))}
            </ServicesList>
          </Card>

          {data?.appointmentImages && data.appointmentImages.length > 0 && (
            <Card>
              <CardTitle>
                <ImageIcon size={20} />
                Vehicle Images
              </CardTitle>

              <ImageGrid>
                {data.appointmentImages.map((img, i) => (
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

      {isSuccessModalOpen && (
        <SuccessModal
          header={title}
          message={modalMessage}
          action={handleChangeSteps}
        />
      )}
      {isErrorModalOpen && (
        <FailedModal
          header={title}
          message={modalMessage}
          action={handleCloseModal}
        />
      )}
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

const PageContainer = styled.div`
  max-height: 100vh;
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  padding: 32px 20px;
  font-family: "Outfit", sans-serif;
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
  background: white;
  padding: 24px 28px;
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
    margin: 0 0 6px 0;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 24px;
    }
  }
`;

const AppointmentId = styled.div`
  font-size: 16px;
  color: #666;
  font-weight: 600;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
`;

const CardTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #00ad4e;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;

  svg {
    color: #00ad4e;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    color: #00ad4e;
  }
`;

const InfoValue = styled.div`
  font-size: 16px;
  color: #333;
  font-weight: 600;
`;

const ServicesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #00ad4e;
    border-radius: 10px;
  }
`;

const ServiceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fdf9;
  border-radius: 10px;
  border-left: 4px solid #00ad4e;
  transition: all 0.3s ease;

  &:hover {
    background: #e8f5e9;
    transform: translateX(4px);
  }
`;

const ServiceNumber = styled.div`
  width: 28px;
  height: 28px;
  background: #00ad4e;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
`;

const ServiceName = styled.div`
  font-size: 15px;
  color: #333;
  font-weight: 600;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const VehicleImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #e8f5e9;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ad4e;
    transform: scale(1.05);
  }
`;

const NotesBox = styled.div`
  padding: 16px;
  background: #f8fdf9;
  border: 2px solid #e8f5e9;
  border-radius: 12px;
  font-size: 15px;
  color: #333;
  line-height: 1.6;
  min-height: 80px;
  white-space: pre-wrap;
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 16px;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SpinnerWrapper = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  border: 2px solid #f44336;
  background: white;
  color: #f44336;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ffebee;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CheckInButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  border: none;
  background: linear-gradient(135deg, #00ad4e 0%, #00c853 100%);
  color: white;
  border-radius: 12px;
  font-size: 16px;
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
