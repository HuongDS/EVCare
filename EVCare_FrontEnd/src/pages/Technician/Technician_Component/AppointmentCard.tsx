import styled from "styled-components";
import NameBox from "./NameBox";
import ReviewButton from "../../../components/Button/ReviewButton";
import { formatDate } from "../../../utils/formatDate";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 12px;
  margin: 15px;
  padding: 10px 20px;
  font-family: "outfit", sans-serif;
`;
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;
const AppointmentID = styled.div`
  display: flex;
  justify-content: space-between;
  column-gap: 1rem;

  font-size: 1.2em;
  font-weight: bold;
  span {
    font-weight: 500;
  }
`;

const AppointmentDate = styled.div`
  display: flex;
  justify-content: flex-end;
  column-gap: 1rem;
  font-size: 19px;
`;
const CardBody = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8em;
`;
const Title = styled.div`
  font-size: 1.5em;
  font-weight: bold;
  padding-bottom: 5px;
  grid-column: span 5;
`;
const Info = styled.div`
  font-size: 1em;
  max-height: 130px;
`;

const InformationStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;
const ListService = styled.div`
  max-width: 20em;
  max-height: 6em;
  overflow: auto;
  margin-top: 8px;
`;

const ButtonStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

type AppointmentCardProps = {
  data: TechnicianAppointmentsDto;
};

export default function AppointmentCard({ data }: AppointmentCardProps) {
  return (
    <Card>
      <CardHeader>
        <AppointmentID>
          AppointmentID: <span>#{data.id}</span>
        </AppointmentID>
        <AppointmentDate>
          <div>
            <i className="bi bi-calendar2-event"></i>
          </div>
          <div> {formatDate(data.appointmentDate)}</div>
        </AppointmentDate>
      </CardHeader>
      <hr style={{ margin: "0.5em" }} />
      <CardBody>
        <InformationStyled>
          <Title>Information</Title>
          <div>
            <NameBox label="Customer's Name" name={data.customerName}></NameBox>
            <NameBox label="Vehicle Model" name={data.vehicleModel}></NameBox>
          </div>
          <div>
            <NameBox label="License Plate" name={data.licensePlate}></NameBox>
            <NameBox label="Phone Number" name={data.phoneNumber}></NameBox>
          </div>
        </InformationStyled>
        <div>
          <Title>Service</Title>
          <ListService>
            <Info>Repaint</Info>
            <Info>Repair</Info>
            <Info>Repaint</Info>
            <Info>Repaint</Info>
          </ListService>
        </div>
        <ButtonStyled>
          <ReviewButton status={3} />
        </ButtonStyled>
      </CardBody>
    </Card>
  );
}
