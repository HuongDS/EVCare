import { AppointmentStatusEnum } from "./enums/AppointmentStatusEnum";

export interface AppointmentViewDetail {
  id: number;
  appointmentDate: Date;
  status: AppointmentStatusEnum;
  note?: string;
  vehicleName: string;
  vehiclePlateNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  employeeName?: string;
  orderId?: number;
  imagesUrls: string[];
  services: string[];
}
