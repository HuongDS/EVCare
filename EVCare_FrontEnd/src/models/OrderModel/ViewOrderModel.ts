export type ViewOrderResponeDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export type ViewOrderDataDto<T> = {
  id: number;
  parts: T[];
  vat: number;
  price: number;
};

export type PartsDetailDto = {
  technicianId: number;
  id: number;
  name: string;
  quantity: number;
  price: number;
  replacementPrice: number;
  imageUrl: string;
};

export type ViewOrderParam = {
  orderId: number;
};
