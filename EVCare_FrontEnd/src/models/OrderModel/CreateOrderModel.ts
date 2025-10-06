export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export type OrderModel = {
  orderID: string;
};

export type OrderParams = {
  appointmentID: number;
  created_At: string;
};
