import type { ApplicationStatusEnum } from "../enums/ApplicationStatusEnum";

export type ApplicationAdminViewDto = {
  id: number;
  employeeName: string;
  dateOff: string;
  reason: string;
  status: ApplicationStatusEnum;
  note: string;
  createdAt: string;
  employeeId: number;
};
