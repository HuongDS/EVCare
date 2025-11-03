import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { TechnicianWorkingSessionEnum } from "../../../models/enums";
import {
  AppointmentList,
  ErrorMessage,
  Watermark,
} from "../TechnicianMyJob/Technician_MyJob.styled";

import AppointmentCard from "./AppointmentCard";
import AppointmentCardProgress from "./AppointmentCardProgress";
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
      {appointments.map((item) => {
        if (
          item.status === TechnicianWorkingSessionEnum.COMPLETED ||
          item.status === TechnicianWorkingSessionEnum.CANCELED
        ) {
          return (
            <AppointmentCard
              key={item.id}
              data={item}
              onStatusChange={onStatusChange}
              onPartsUpdated={onPartsUpdated}
            />
          );
        }

        return (
          <AppointmentCardProgress
            key={item.id}
            data={item}
            onStatusChange={onStatusChange}
            onPartsUpdated={onPartsUpdated}
          />
        );
      })}
    </AppointmentList>
  );
};
