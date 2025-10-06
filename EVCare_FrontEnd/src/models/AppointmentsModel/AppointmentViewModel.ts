import type { Dayjs } from "dayjs";
import type { AppointmentStatusEnum } from "../enums";

export type AppointmentViewModel = {
  id: number;
  appointmentDate: Dayjs;
  vehicleModel: string;
  customerName: string;
  phoneNumber: string;
  licensePlate: string;
  services: string[];
  vehicleImageUrl?: string[];
  status: AppointmentStatusEnum;
  note?: string;
};

//này có trong Staff_Appointment_Model
