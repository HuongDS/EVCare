export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export type OrderPartsResponseDto = {
  id: number;
  name: string;
  quantity: number;
  replacementPrice: number;
  price: number;
  categoryId: number;
  isDeleted: boolean;
  imageUrl: string;
};

export type PageModel<T> = {
  items: T[];
  pageSize: number;
  pageIndex: number;
  totalItems: number;
  totalPages: number;
};

export type UpdateOrderPartDto = {
  orderId: number;
  parts: {
    id: number;
    quantity: number;
  }[];
};
