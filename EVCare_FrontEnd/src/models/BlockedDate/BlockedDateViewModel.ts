import type { Dayjs } from "dayjs";

export type BlockedDateViewModel = {
  dateTime: Dayjs;
  reason: string;
};
