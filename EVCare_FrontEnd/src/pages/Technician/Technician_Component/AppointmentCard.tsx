import { useState, useEffect } from "react";
import NameBox from "./NameBox";
import ReviewButton from "./Button";
import { formatDate } from "../../../utils/formatDate";
import { updateTechnicianWorkingSession } from "../../../services/TechnicianWorkingSessionApi";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";
import { ERROR_MESSAGE } from "../../../constants/messages/Message";

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
  AppointmentStatus,
  ListPart,
  AppointmentImagesWrapper,
  AppointmentImages,
  ImageItem,
  DotsContainer,
  Dot,
} from "./Style/AppointmentCard.styled";

type AppointmentCardProps = {
  data: TechnicianAppointmentsDto;
  onStatusChange?: (orderId: number, newStatus: TechnicianWorkingSessionEnum) => void;
  onPartsUpdated?: (orderId: number) => void;
};

export default function AppointmentCard({ data, onStatusChange, onPartsUpdated }: AppointmentCardProps) {
  const [currentStatus, setCurrentStatus] = useState<TechnicianWorkingSessionEnum>(
    data.status as TechnicianWorkingSessionEnum
  );

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (!data.appointmentImages || data.appointmentImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev === data.appointmentImages!.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [data.appointmentImages]);

  const handleAction = async (nextStatus: TechnicianWorkingSessionEnum) => {
    const prevStatus = currentStatus;
    setCurrentStatus(nextStatus);
    onStatusChange?.(data.orderId, nextStatus);

    try {
      await updateTechnicianWorkingSession({
        orderId: data.orderId,
        status: nextStatus,
      });
      onPartsUpdated?.(data.orderId);
    } catch (err) {
      console.error(err);
      setCurrentStatus(prevStatus);
      onStatusChange?.(data.orderId, prevStatus);
      alert(ERROR_MESSAGE.CAN_NOT_UPDATE_STATUS);
    }
  };

  return (
    <Card>
      <CardHeader>
        <AppointmentID>
          AppointmentID: <span>#{data.id}</span>
        </AppointmentID>

        <AppointmentStatus $status={currentStatus}>{currentStatus.replace("_", " ")}</AppointmentStatus>

        <AppointmentDate>
          <i className="bi bi-calendar2-event"></i> {formatDate(data.appointmentDate)}
        </AppointmentDate>
      </CardHeader>

      <hr style={{ margin: "0.5em 0" }} />

      <CardBody>
        {/* Column 1: Images */}
        {data.appointmentImages && data.appointmentImages.length > 0 && (
          <div>
            <Title>Appointment Images</Title>

            <AppointmentImagesWrapper>
              <AppointmentImages $currentIndex={currentImage}>
                {data.appointmentImages.map((img, idx) => (
                  <ImageItem key={idx}>
                    <img src={img} alt={`Appointment ${idx}`} />
                  </ImageItem>
                ))}
              </AppointmentImages>

              <DotsContainer>
                {data.appointmentImages.map((_, idx) => (
                  <Dot key={idx} $active={idx === currentImage} onClick={() => setCurrentImage(idx)} />
                ))}
              </DotsContainer>
            </AppointmentImagesWrapper>
          </div>
        )}

        {/* Column 2: Information */}
        <div>
          <Title>Information</Title>
          <InformationStyled>
            <div>
              <NameBox label="Customer's Name" name={data.customerName} />
              <NameBox label="Vehicle Model" name={data.vehicleModel} />
            </div>
            <div>
              <NameBox label="License Plate" name={data.licensePlate} />
              <NameBox label="Phone Number" name={data.phoneNumber ?? "default"} />
            </div>
          </InformationStyled>
        </div>

        {/* Column 3: Services */}
        <div>
          <Title>Service</Title>
          <ListService>
            {data.services?.map((service, idx) => (
              <Info key={idx}>{service}</Info>
            ))}
          </ListService>
        </div>

        {/* Column 4: Parts */}
        {data.parts && data.parts.length > 0 && (
          <div>
            <Title>Parts Added</Title>
            <ListPart>
              {data.parts.map((part, idx) => (
                <Info key={idx}>
                  {part.name} x {part.quantity}
                </Info>
              ))}
            </ListPart>
          </div>
        )}
      </CardBody>

      <ButtonStyled>
        <ReviewButton status={currentStatus} onAction={handleAction} appointment={data} orderId={data.orderId} />
      </ButtonStyled>
    </Card>
  );
}
