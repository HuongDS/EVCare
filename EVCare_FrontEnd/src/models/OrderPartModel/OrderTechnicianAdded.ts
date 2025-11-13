export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export type PartAddByTech = {
  partID: number;
  partName: string;
  orderId: number;
  quantity: number;
  price: number;
};

export type TechnicianAddedPartsRequest = {
  orderId: number;
};
