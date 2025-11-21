import type { ApplicationStatusEnum } from "../enums/ApplicationStatusEnum";

export type ApplicationUpdateDto = {
  id: number;
  status: ApplicationStatusEnum;
  note: string;
};
