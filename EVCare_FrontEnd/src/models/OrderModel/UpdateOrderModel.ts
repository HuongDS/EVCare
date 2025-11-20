export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export type OrderPartDto = {
  partId: number;
  technicianId: number;
  quantity: number;
};

export type UpdateOrderRequest<T> = {
  id: number;
  orderParts: T[];
};

export type UpdateOrderStatusPrams = {
  orderID: number;
  status: string;
};

export type UpdateOrderResponse = {
  orderID: number;
};

export type AssignTechWithPendingPartPayload = {
  orderId: number;
  updateParts: PartPendingUpdate[];
};

export type PartPendingUpdate = {
  partId: number;
  oldTechnicianId: number;
  newTechnicianId: number;
};
