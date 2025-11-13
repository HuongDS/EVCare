import type { TechnicianWorkingSessionEnum } from "../enums";

export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export type PageModel<T> = {
  items?: T[];
  pageSize: number;
  pageIndex: number;
  totalItems: number;
  totalPages: number;
};

export type TechnicianAppointmentsDto = {
  id: number;
  appointmentDate: string;
  vehicleModel: string;
  customerName: string;
  phoneNumber: string;
  licensePlate: string;
  services: string[];
  parts: {
    technicianId: number;
    id: number;
    name: string;
    quantity: number;
    price: number;
    imageUrl: string;
  }[];
  status: TechnicianWorkingSessionEnum;
  appointmentImages: string[];
  orderId: number;
};

//Get technicians for assigning appointment
export type TechnicianModel<T> = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  expYears: number;
  status: string;
  workingSessionStatus: string;
  kpiPerDays: number;
  completedOrders: number;
  skills: T[];
  avatar?: string;
};

export type GetTechnicianParams = {
  FullName?: string;
  Status?: string;
  Skills?: number[];
  PageSize?: number;
  PageIndex?: number;
  SortField?: string;
  SortOrder?: string;
};

export type TechnicianSkills = {
  id: number;
  name: string;
};

export type AssignTechnicianParams = {
  orderId: number;
  technicianIds: number[];
  status: string;
};

export type ServiceViewModel = {
  serviceId: number;
  serviceName: string;
};

export type GetPartsInServicesParams = {
  serviceIds?: number[];
  keyWord?: string;
  pageSize?: number;
  pageIndex?: number;
  sortField?: string[];
  sortOrder?: string[];
};
