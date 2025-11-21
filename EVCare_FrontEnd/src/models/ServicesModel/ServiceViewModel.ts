export type Service = {
  id: number;
  name: string;
  description: string;
  duration: number;
  isDeleted: boolean;
  serviceCategoryId: number;
  parts: PartInService[];
};

export type PartInService = {
  id: number;
  name: string;
  image: string;
};

export type GetServiceParams = {
  keyword?: string;
  pageSize?: number;
  pageIndex?: number;
  sortField?: string;
  sortOrder?: string;
};
