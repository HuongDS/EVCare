export type PartDetailDto = {
  id: number;
  name: string;
  quantity: number;
  replacementPrice: number;
  price: number;
  categoryId: number;
  isDeleted: boolean;
  imageUrl: string;
};

export type GetPartParams = {
  partName?: string;
  categoryId?: number;
  pageSize?: number;
  pageIndex?: number;
};
