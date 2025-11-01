export type Service = {
  id: number;
  name: string;
  description: string;
  duration: number;
  isDeleted: boolean;
  serviceCategoryId: number;
};

export type GetServiceParams = {
  keyword?: string;
  pageSize?: number;
  pageIndex?: number;
  sortField?: string;
  sortOrder?: string;
};
