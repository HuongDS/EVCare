import type { ApplicationStatusEnum } from "../enums/ApplicationStatusEnum";

export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export type ApplicationRequestDTO = {
  employeeID: number;
  dateOff: string;
  reason: string;
};

export type ApplicationResponseDTO = {
  dateOff: string;
  reason: string;
  status: ApplicationStatusEnum;
  isApproved: boolean;
  note: string;
  createdAt: string;
};

export type DateOffResponseDTO = string[];

export type PageModel<T> = {
  items: T[];
  pageSize: number;
  pageIndex: number;
  totalItems: number;
  totalPages: number;
};

export type GetApplicationsParams = {
  isApproved?: boolean;
  pageSize?: number;
  pageIndex?: number;
  sortField?: string[];
  sortOrder?: string[];
};
