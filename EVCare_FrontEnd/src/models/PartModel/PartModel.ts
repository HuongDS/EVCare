export type PartDetailDto = {
  id: number;
  name: string;
  stock: number;
  description: string;
  replacementPrice: number;
  price: number;
  categoryId: number;
  isDeleted: boolean;
  imageUrl: string;
};

export type GetPartParams = {
  partName?: string;
  CategoryIds?: number[];
  pageSize?: number;
  pageIndex?: number;
  sortField?: string;
  sortOrder?: string;
};

export interface Category {
  id: number;
  name: string;
  description: string;
  isDeleted: boolean;
}

export type PartDetail = {
  id: number;
  name: string;
  quantity: number;
  description: string;
  replacementPrice: number;
  price: number;
  categoryId: number;
  isDeleted: boolean;
  imageUrl: string;
};
