import type { CustomerRankEnum } from "../enums";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rank: CustomerRankEnum;
  totalSpending: number;
}
