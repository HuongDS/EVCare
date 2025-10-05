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
  services: [];
  parts: string[];
  status: number;
};

//Get technicians for assigning appointment

export type TechnicianModel<T> = {
  id: number;
  fullName: "string string";
  phone: "0907829278";
  expYears: 8;
  rating: null;
  status: "Available";
  skills: T[];
  avatar?: string;
};

export type GetTechnicianParams = {
  Status?: string;
  Skills?: number;
  PageSize?: number;
  PageIndex?: number;
  SortField?: string;
  SortOrder?: string;
};
