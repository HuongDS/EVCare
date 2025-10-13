export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export type OrderModel = {
  orderID: number;
};

export type CreateOrderParams = {
  appointmentID: number;
  created_At: string;
};
