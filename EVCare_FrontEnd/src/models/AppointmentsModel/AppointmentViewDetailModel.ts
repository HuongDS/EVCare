import type { Dayjs } from "dayjs";
import type { AppointmentStatusEnum } from "../enums";

export type AppointmentViewDetailModel = {
  id: number;
  appointmentDate: Dayjs;
  status: AppointmentStatusEnum;
  note: string;
  vehicleName: string;
  vehiclePlateNumber: string;
  customerName: string;
  customerPhone: string;
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
