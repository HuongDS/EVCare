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
  orderId: number;
};
