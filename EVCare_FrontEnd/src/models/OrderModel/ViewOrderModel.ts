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
  percentInprogress: number;
};

export type PartsDetailDto = {
  technicianId: number;
  technicianName: string;
  id: number;
  name: string;
  quantity: number;
  price: number;
  replacementPrice: number;
  stock: number;
  imageUrl: string;
};

export type ViewOrderParam = {
  orderId: number;
};
