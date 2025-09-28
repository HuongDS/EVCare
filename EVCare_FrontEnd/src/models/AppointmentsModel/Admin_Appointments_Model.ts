export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};
