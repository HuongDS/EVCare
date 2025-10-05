// AppointmentCard.tsx
import { useState } from "react";
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
} from "./Style/AppointmentCard.styled";

type AppointmentCardProps = {
  data: TechnicianAppointmentsDto;
  onStatusChange?: (
    orderId: number,
    newStatus: TechnicianWorkingSessionEnum
  ) => void;
};

export default function AppointmentCard({
  data,
  onStatusChange,
}: AppointmentCardProps) {
  const [currentStatus, setCurrentStatus] =
    useState<TechnicianWorkingSessionEnum>(
      data.status as TechnicianWorkingSessionEnum
    );

  const handleAction = async (nextStatus: TechnicianWorkingSessionEnum) => {
    const prevStatus = currentStatus;
    setCurrentStatus(nextStatus); // Update UI ngay
    onStatusChange?.(data.orderId!, nextStatus); // Update parent & tab

    try {
      await updateTechnicianWorkingSession({
        orderId: data.orderId!,
        status: nextStatus,
      });
    } catch (err) {
      console.error(err);
      setCurrentStatus(prevStatus);
      onStatusChange?.(data.orderId!, prevStatus); // rollback
      alert(ERROR_MESSAGE.CAN_NOT_UPDATE_STATUS);
    }
  };

  return (
    <Card>
      <CardHeader>
        <AppointmentID>
          AppointmentID: <span>#{data.id}</span>
        </AppointmentID>
        <AppointmentStatus>
          <div>
            <i className="bi bi-check-circle"></i>
          </div>
          <div>{currentStatus}</div>
        </AppointmentStatus>
        <AppointmentDate>
          <div>
            <i className="bi bi-calendar2-event"></i>
          </div>
          <div>{formatDate(data.appointmentDate)}</div>
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
            {data.services?.map((service, idx) => (
              <Info key={idx}>{service}</Info>
            ))}
          </ListService>
        </div>

        <ButtonStyled>
          <ReviewButton status={currentStatus} onAction={handleAction} />
        </ButtonStyled>
      </CardBody>
    </Card>
  );
}
