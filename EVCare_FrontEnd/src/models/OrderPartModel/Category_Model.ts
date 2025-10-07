export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export type CategoryResponseDTO = {
  id: number;
  name: string;
  description: string;
};

export type PageModel<T> = {
  items: T[];
  pageSize: number;
  pageIndex: number;
  totalItems: number;
  totalPages: number;
};
