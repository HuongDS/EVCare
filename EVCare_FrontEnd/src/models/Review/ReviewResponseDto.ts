export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data: T;
};

export type ReviewResponseDto = {
  id: number;
  rating: number;
  content: string;
  createdAt: string;
  customerName: string;
  services: { id: number; name: string }[];
};

export type PageModel<T> = {
  items: T[];
  pageSize: number;
  pageIndex: number;
  totalItems: number;
  totalPages: number;
};
