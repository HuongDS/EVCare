export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export type OrderPartsResponseDto = {
  partId: number;
  partName: string;
  quantity: number;
  price: number;
  categoryId: number;
  isDeleted: boolean;
  imageUrl: string;
};
