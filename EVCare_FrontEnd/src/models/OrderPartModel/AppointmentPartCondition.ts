import type { DamageLevelEnum } from "../enums/DamageLevelEnum";

export interface AppointmentPartCondition {
  appointmentId: number;
  partDamageLevels: {
    partId: number;
    partName: string;
    partUrl: string;
    damageLevel: DamageLevelEnum;
    quantity: number;
    price: number;
  }[];
}

export type ResponseDto<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export interface UpdatePartDamageDto {
  appointmentId: number;
  partDamageLevels: {
    partId: number;
    levelEnum: DamageLevelEnum;
  }[];
}
