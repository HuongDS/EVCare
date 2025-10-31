export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export type TechnicianAddedPart = {
  partID: number;
  partName: string;
  orderId: number;
  quantity: number;
  price: number;
};

export type TechnicianAddedPartsRequest = {
  orderId: number;
};
