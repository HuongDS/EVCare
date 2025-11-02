import type { EmployeeStatusEnum } from "../enums";

export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export interface TechnicianDetailModel {
  id: number;
  fullName: string;
  phone: string;
  expYears: number;
  status: EmployeeStatusEnum;
  skills: {
    id: number;
    name: string;
  }[];
}
