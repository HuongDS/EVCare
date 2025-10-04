import NameBox from "./NameBox";
import ReviewButton from "../../../components/SwitchButton/ReviewButton";
import { formatDate } from "../../../utils/formatDate";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import {
  Card,
  CardBody,
  CardHeader,
  AppointmentID,
  AppointmentDate,
  InformationStyled,
  Title,
  ListService,
  ButtonStyled,
  Info,
} from "./Style/AppontmentCard.styled";

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
            <NameBox label="Customer's Name" name={data.customerName} />
            <NameBox label="Vehicle Model" name={data.vehicleModel} />
          </div>
          <div>
            <NameBox label="License Plate" name={data.licensePlate} />
            <NameBox label="Phone Number" name={data.phoneNumber} />
          </div>
        </InformationStyled>

        <div>
          <Title>Service</Title>
          <ListService>
            {data.services.map((service, idx) => (
              <Info key={idx}>{service}</Info>
            ))}
          </ListService>
        </div>

        <ButtonStyled>
          {/* Nếu status trong API là string, bạn có thể parse sang number nếu cần */}
          <ReviewButton status={Number(data.status)} />
        </ButtonStyled>
      </CardBody>
    </Card>
  );
}
