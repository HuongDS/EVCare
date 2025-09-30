import type { CustomerRankEnum } from "../enums";

export type CustomerViewDto = {
  id: number;
  address: string;
  rank: CustomerRankEnum;
};
