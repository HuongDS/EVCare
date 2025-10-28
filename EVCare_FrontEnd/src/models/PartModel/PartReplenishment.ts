export type PartReplenishment = {
  partId: number;
  partName: string;
  minStock: number;
  needQuantity: number;
  reason: string;
};

export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data: T;
};

export type PageModel<T> = {
  items: T[];
  pageSize: number;
  pageIndex: number;
  totalItems: number;
  totalPages: number;
};
