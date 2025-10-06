export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export type CreateOrderRequest = {
  appointmentID: number;
  created_At: string;
};
