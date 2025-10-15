import type { RegisterRequestDto } from "../AuthModel/authModel";
import type { RoleEnum } from "../enums";

export type EmployeeRegisterDto = {
  role: RoleEnum;
  CCCD: string;
  expYear: number;
  accountInfo: RegisterRequestDto;
};
