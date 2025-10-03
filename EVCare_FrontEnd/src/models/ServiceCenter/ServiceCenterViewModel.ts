import type { Dayjs } from "dayjs";

export type ServiceCenterViewModel = {
  name: string;
  address: string;
  openTime: Dayjs;
  closeTime: Dayjs;
  hotline: string;
};
