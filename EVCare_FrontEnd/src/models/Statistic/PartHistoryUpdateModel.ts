import type { ActionTypeEnum } from "../enums/ActionTypeEnum";

export type PartHistoryUpdateModel = {
  partName: string;
  partCategoryName: string;
  imageUrl: string;
  employeeName: string;
  actionType: ActionTypeEnum;
  changeDate: string;
  oldQuantity: number;
  newQuantity: number;
  oldUnitPrice: number;
  newUnitPrice: number;
  oldReplacePrice: number;
  newReplacePrice: number;
};
