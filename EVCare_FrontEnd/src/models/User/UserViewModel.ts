import type { Rank } from "../enums/AccountRankingEnum";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rank: Rank;
  totalSpending: number;
}
