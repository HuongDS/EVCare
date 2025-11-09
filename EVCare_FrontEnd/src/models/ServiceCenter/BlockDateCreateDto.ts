import type { UnavailableTypeEnum } from "../enums/UnavailableTypeEnum";

export type BlockDateCreateDto = {
  date: string;
  reason: string;
  unavailableType: UnavailableTypeEnum;
};
