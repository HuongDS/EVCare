import type { ServiceViewFormModel } from "../ServicesModel/ServiceViewFormModel";

export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export type ResponseDtoCreateAppointment<T> = {
  statusCode: number;
  message?: string;
  appointmentId?: T;
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
  keyWord?: string;
  status?: string;
  beginTime?: string;
  endTime?: string;
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

//Payload nhập remind schedule
export type RemindSchedulePayload = {
  id?: number;
  reminderIntervalMonths?: number;
};

//Payload tạo appointment
export type StaffCreateAppointmentPayload = {
  customerId: number;
  vehicleId: number;
  note: string;
  appointment_Date: any;
  imagesUrls: string[] | undefined;
  serviceIds: number[];
};

//UploadImage appointment
export type MultipleImageDto = {
  fileName: string;
  url: string;
  errorMessage: string | null;
};

//appointment detail
export type AppointmentDetailModel<T> = {
  id: number;
  appointmentDate: string;
  status: string;
  note: string;
  vehicleId: number;
  vehicleName: string;
  vehiclePlateNumber: string;
  customerName: string;
  phoneNumber: string;
  customerEmail: string;
  employeeName: string;
  orderId: number;
  imagesUrls: string[];
  services: ServiceViewFormModel[];
  technicians: T[];
};
