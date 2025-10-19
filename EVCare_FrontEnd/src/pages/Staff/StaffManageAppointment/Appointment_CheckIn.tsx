import styled from "styled-components";
import TextAreaDisabled from "../../../components/TextField/TextAreaDisabled";
import type { StaffAppointmentsDto } from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import ButtonAction from "../../../components/Button/ReviewButton";
import { useAppDispatch } from "../../../states/store";
import { setStep } from "../../../states/appointmentSlice";
import { changeAppointmentStatus } from "../../../services/appointmentServiceApi";
import { CreateNewOrder } from "../../../services/orderServiceApi";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import type {
  TechnicianModel,
  TechnicianSkills,
} from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { useQueryClient } from "@tanstack/react-query";
import SpinnerComponent from "../../../components/SpinnerComponent";

interface Props {
  data: StaffAppointmentsDto<TechnicianModel<TechnicianSkills>>;
  currentStep: number;
}

export default function Appointment_CheckIn({ data, currentStep }: Props) {
  const dispatch = useAppDispatch();
  const { mutateAsync: newOrder } = CreateNewOrder();
  const { mutateAsync: appointmentStatus, isPending } = changeAppointmentStatus();
  const queryClient = useQueryClient();

  const handleCheckIn = async (status: "CheckedIn" | "Canceled") => {
    try {
      const changeStatus = {
        appointmentId: data.id,
        status: status,
      };

      const createNewOrderParams = {
        appointmentID: data.id,
        created_At: new Date().toISOString(),
      };

      const response = await newOrder(createNewOrderParams);

      data.orderId = response.data?.orderID || 0;

      await appointmentStatus(changeStatus);

      await queryClient.invalidateQueries({ queryKey: ["Staff Appointments"] });

      dispatch(setStep({ id: data.id, step: currentStep + 1 }));
    } catch (error) {
      console.error("Error changing appointment status:", error);
    }
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
          {/* Uncomment to display vehicle images */}

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
        <ButtonAction text="Cancel" color="red" backgroundColor="#f1f1f1" action={() => handleCheckIn("Canceled")} />
        {isPending ? (
          <SpinnerComponent />
        ) : (
          <ButtonAction
            text="Check In"
            color="white"
            backgroundColor="#00AD4E"
            action={() => handleCheckIn("CheckedIn")}
          />
        )}
      </ButtonWapper>
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
