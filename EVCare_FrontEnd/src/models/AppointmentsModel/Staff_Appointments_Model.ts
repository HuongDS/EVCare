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

export type StaffAppointmentsDto<T> = {
  id: number;
  appointmentDate: string;
  vehicleModel: string;
  customerName: string;
  phoneNumber: string;
  licensePlate: string;
  services: ServiceViewFormModel[];
  appointmentImages: string[];
  status: string;
  technicians: T[];
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

//Type lấy danh sách các cuộc hẹn có kỹ thuật viên rời việc
export type GetAppointmentWithTechnician<T> = {
  id: number;
  appointmentDate: string;
  vehicleName: string;
  vehiclePlateNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  services: [];
  technicians: T[];
};
