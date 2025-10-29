import styled from "styled-components";
import TextAreaDisabled from "../../../components/TextField/TextAreaDisabled";
import type { StaffAppointmentsDto } from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import ButtonAction from "../../../components/Button/ReviewButton";
import { useAppDispatch } from "../../../states/store";
import { setStep } from "../../../states/appointmentSlice";
// import { changeAppointmentStatus } from "../../../services/appointmentServiceApi";
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
  const [title, setTitle] = useState("");
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
      setTitle("Appointment Status");
      setModalMessage(String(error));
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
    <>
      <CheckInWrapper>
        <CustomerInformation>
          <h5>
            Appointment ID: <span>#{data.id}</span>
          </h5>
          <GroupField>
            <div>Customer Name</div>
            <p>{data.customerName}</p>
          </GroupField>
          <GroupField>
            <div>Vehicle Model</div>
            <p>{data.vehicleModel}</p>
          </GroupField>
          <GroupField>
            <div>License Plate</div>
            <p>{data.licensePlate}</p>
          </GroupField>
          <GroupField>
            <div>Phone Number</div>
            <p>{data.phoneNumber ?? "default"}</p>
          </GroupField>
        </CustomerInformation>

        <ServiceGroup>
          <h5>Services</h5>
          <Services>
            {data.services.map((service, index) => (
              <p key={index}>
                {index + 1}. {service.name}
              </p>
            ))}
          </Services>
        </ServiceGroup>

        <ImageGroup>
          {data?.appointmentImages?.map((img, i) => (
            <Zoom key={i}>
              <img src={img} alt={`image ${i + 1}`} key={i} />
            </Zoom>
          ))}
        </ImageGroup>

        <TextAreaContainer>
          <TextAreaDisabled value={data.note} />
        </TextAreaContainer>
      </CheckInWrapper>
      <ButtonWapper>
        {isPending ? (
          <SpinnerComponent />
        ) : (
          <>
            <ButtonAction
              text="Cancel"
              color="red"
              backgroundColor="#f1f1f1"
              action={() => setConfirm(true)}
            />
            <ButtonAction
              text="Check In"
              color="white"
              backgroundColor="#00AD4E"
              action={() => handleCheckIn("CheckedIn")}
            />
          </>
        )}
      </ButtonWapper>
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
    </>
  );
}

const CheckInWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(2, auto);
  padding: 20px 30px;
  font-family: "Outfit", sans-serif;
  gap: 20px;
`;

const Section = styled.div`
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
  background-color: #fff;
`;

const CustomerInformation = styled(Section)`
  grid-column: 1 / 2;
  grid-row: 1;

  h5 {
    background-color: #f1f1f1;
    padding: 5px 2px;
    border-radius: 10px;
    font-weight: bold;
  }
`;

const GroupField = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-size: 16px;
  color: #ccc;

  div {
    font-style: italic;
    color: #686868;
  }
  p {
    font-weight: bold;
    font-size: 18px;
    color: black;
    margin-bottom: 10px;
  }
`;

const ServiceGroup = styled(Section)`
  grid-column: 2 / 3;
  grid-row: 1;

  h5 {
    background-color: #f1f1f1;
    padding: 5px 2px;
    border-radius: 10px;
    font-weight: bold;
  }
`;

const Services = styled.div`
  max-height: 200px;
  overflow-y: auto;

  p {
    font-size: 15px;
  }
`;

const ImageGroup = styled(Section)`
  grid-column: 1 / 2;
  grid-row: 2;
  display: flex;
  justify-content: center;
  gap: 5%;
  img {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }
`;

const TextAreaContainer = styled(Section)`
  grid-column: 2 / 3;
  grid-row: 2;
`;

const ButtonWapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
`;
