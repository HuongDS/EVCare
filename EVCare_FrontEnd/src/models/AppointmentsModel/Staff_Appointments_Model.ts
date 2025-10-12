import type { ServiceViewFormModel } from "../ServicesModel/ServiceViewFormModel";

export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

//Get appointment
export type PageModel<T> = {
  items?: T[];
  pageSize: number;
  pageIndex: number;
  totalItems: number;
  totalPages: number;
};

export type StaffAppointmentsDto = {
  id: number;
  appointmentDate: string;
  vehicleModel: string;
  customerName: string;
  phoneNumber: string;
  licensePlate: string;
  services: ServiceViewFormModel[];
  appointmentImages: string[];
  status: string;
  orderId: number;
  note: string;
};

export type GetAppointmentsParams = {
  customerName?: string;
  status?: string;
  beginTime?: Date;
  endTime?: Date;
  pageSize?: number;
  pageIndex?: number;
  sortField?: string;
  sortOrder?: string;
};

//Change appointment status
export type ChangeAppointmentStatusParams = {
  appointmentId: number;
  status: string;
};
