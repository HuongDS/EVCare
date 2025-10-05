import type { StaffAppointmentsDto } from "../AppointmentsModel/Staff_Appointments_Model";

export interface AppointmentState {
  items: StaffAppointmentsDto[];
  pageSize: number;
  pageIndex: number;
  totalItems: number;
  totalPages: number;
  loading: boolean;
  error?: string | null;
}
