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
  status: string;
  appointmentImages: string[];
  orderId: number;
};

//Get technicians for assigning appointment

export type TechnicianModel<T> = {
  id: number;
  fullName: string;
  phone: string;
  expYears: number;
  rating: null;
  status: string;
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
