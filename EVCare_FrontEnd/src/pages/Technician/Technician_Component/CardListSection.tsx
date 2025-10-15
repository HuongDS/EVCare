import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import type { TechnicianWorkingSessionEnum } from "../../../models/enums";
import {
  AppointmentList,
  Watermark,
  ErrorMessage,
} from "../TechnicianGeneral/Technician_General.styled";
import AppointmentCard from "./AppointmentCard";
import LoadingOverlay from "./LoadingOverlay";

export const CardListSection = ({
  isError,
  fade,
  appointments,
  onStatusChange,
  onPartsUpdated,
  isLoading,
}: {
  isError: boolean;
  fade: boolean;
  appointments: TechnicianAppointmentsDto[];
  onStatusChange: (
    orderId: number,
    newStatus: TechnicianWorkingSessionEnum
  ) => void;
  onPartsUpdated: (orderId: number) => void;
  isLoading?: boolean;
}) => {
  if (isError)
    return <ErrorMessage>Error loading technician appointments</ErrorMessage>;

  if (isLoading)
    return (
      <AppointmentList style={{ position: "relative", minHeight: "300px" }}>
        <LoadingOverlay />
      </AppointmentList>
    );

  if (appointments.length === 0)
    return <Watermark>No appointments found</Watermark>;

  return (
    <AppointmentList className={fade ? "fade-out" : ""}>
      {appointments.map((item) => (
        <AppointmentCard
          key={item.id}
          data={item}
          onStatusChange={onStatusChange}
          onPartsUpdated={onPartsUpdated}
        />
      ))}
    </AppointmentList>
  );
};
