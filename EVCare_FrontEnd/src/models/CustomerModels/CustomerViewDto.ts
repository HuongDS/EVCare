import type { CustomerRankEnum } from "../enums";

export type CustomerViewDto = {
  id: number;
  address: string;
  rank: CustomerRankEnum;
};

export type GetCustomerListParams = {
  keyword?: string;
  pageSize?: number;
  pageIndex?: number;
  sortField?: string;
  sortOrder?: string;
};
