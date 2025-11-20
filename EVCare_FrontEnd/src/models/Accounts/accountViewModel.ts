import type { RoleEnum } from "../enums";

export type AccountViewModel = {
  id: number;
  techId: number;
  role: RoleEnum;
  email: string;
  first_Name: string;
  last_Name: string;
  phone?: string;
};
