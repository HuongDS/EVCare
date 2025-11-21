import type { DamageLevelStringEnum } from "../enums/DamageLevelEnum";

export type AppointmentPartCondition<T> = {
  appointmentId: number;
  partDamageLevels: T[];
};

export type PartDamageLevelDetail = {
  partId: number;
  partName: string;
  partUrl: string;
  damageLevel: DamageLevelStringEnum;
  quantity: number;
  price: number;
};

export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export interface UpdatePartDamageDto {
  appointmentId: number;
  partDamageLevels: {
    partId: number;
    levelEnum: DamageLevelStringEnum;
  }[];
}
