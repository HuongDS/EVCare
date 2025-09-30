export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export type ServicePageModel<T> = {
  items?: T[];
  pageSize: number;
  pageIndex: number;
  totalItems: number;
  totalPages: number;
};

export type ServicesResponseDto = {
  id: number;
  name: string;
  description: string;
  duration: number;
  isDeleted: boolean;
};
