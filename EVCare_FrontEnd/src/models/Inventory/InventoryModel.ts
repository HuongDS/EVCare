export type UpdateInventoryPayload = {
  id: number;
  description: string;
  unitPrice: number;
  stock: number;
  image: string;
};

export type AIPredictionPageModel<T> = {
  items: T[];
  pageSize: number;
  pageIndex: number;
  totalItems: number;
  totalPages: number;
};

export type AIPredictionItems = {
  partId: number;
  partName: string;
  minStock: number;
  needQuantity: number;
  reason: string;
};

export type AIPreditionParams = {
  LeadDate?: number;
  PageSize?: number;
  PageIndex?: number;
  SortField?: string;
  SortOrder?: string;
};
