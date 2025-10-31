import type { RoleEnum } from "../enums";

export type Participants = {
  accountId: string;
  role: RoleEnum;
  name: string;
  phone: string;
};
