import type { UnavailableTypeEnum } from "../enums/UnavailableTypeEnum";

export type BlockDateViewDto = {
  dateTime: string;
  reason: string;
  unavailableType: UnavailableTypeEnum;
};
