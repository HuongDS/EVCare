import type { Dayjs } from "dayjs";
import type { AppointmentStatusEnum } from "../enums";

export type AppointmentViewDetailModel = {
  id: number;
  appointmentDate: Dayjs;
  status: AppointmentStatusEnum;
  note: string;
  vehicleId: number;
  vehicleName: string;
  vehiclePlateNumber: string;
  customerName: string;
  phoneNumber: string;
  customerEmail: string;
  employeeName: string;
  orderId: number;
  appointmentImages: string[];
  services: ServiceDto[];
};

type ServiceDto = {
  id: number;
  name: string;
};
