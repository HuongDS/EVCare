import type { DamageLevelEnum } from "../enums/DamageLevelEnum";

export interface AppointmentPartCondition {
  appointmentId: number;
  partDamageLevels: {
    partId: number;
    partName: string;
    partUrl: string;
    damageLevel: string;
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
