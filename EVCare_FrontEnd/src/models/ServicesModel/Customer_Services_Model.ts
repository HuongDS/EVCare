export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export type ServicesResponseDto = {
  id: number;
  name: string;
  description: string;
  duration: number;
  isDeleted: boolean;
};
