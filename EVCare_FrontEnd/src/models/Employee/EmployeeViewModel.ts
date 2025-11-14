import type { EmployeeStatusEnum, RoleEnum } from "../enums";
import type { ServiceViewFormModel } from "../ServicesModel/ServiceViewFormModel";

export type EmployeeViewModel = {
  accountId: number;
  employeeId: number;
  fullName: string;
  email: string;
  phone: string;
  cccd: string;
  role: RoleEnum;
  status: EmployeeStatusEnum;
  isBanned: boolean;
  avatar?: string;
  technicianId?: number;
  expYear?: number;
  kpiGetDays?: number;
  completedOrderToday?: number;
  skills: ServiceViewFormModel[];
};
