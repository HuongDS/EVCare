export type PartDetailDto = {
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

export type PartInServiceDetail = PartDetail & {
  serviceId: number;
};

export type PartInServiceViewModel<T> = {
  items: T[];
};

export type UpdatePartStatusPayload = {
  orderId: number;
  partId: number;
  isReplaced: boolean;
};

export type PartPendingDto = {
  technicianId: number;
  technicianName: string;
  id: number;
  name: string;
  quantity: number;
  price: number;
  replacementPrice: number;
  stock: number;
  partStatus: string;
  imageUrl: string;
};

export type PartOfTech = {
  id: number;
  name: string;
};
