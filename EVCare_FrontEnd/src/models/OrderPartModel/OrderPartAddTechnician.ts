export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export type OrderPartAddTechnicianDto = {
  partID: number;
  orderId: number;
  technicianId: number;
  quantity: number;
};

export type AddPartsRequest = {
  orderId?: number;
  listParts: OrderPartAddTechnicianDto[];
};

export type AddPartsResponse = {
  listParts: OrderPartAddTechnicianDto[];
};
