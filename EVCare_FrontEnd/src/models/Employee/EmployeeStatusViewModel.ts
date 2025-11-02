import type { EmployeeStatusEnum } from "../enums";

export type EmployeeStatusViewModel = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  statusEnum: EmployeeStatusEnum;
};
