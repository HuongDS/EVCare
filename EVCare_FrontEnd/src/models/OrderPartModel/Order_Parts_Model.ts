export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export type OrderPartsResponseDto = {
  partId: number;
  partName: string;
  orderId: number;
  quantity: number;
  price: number;
};
