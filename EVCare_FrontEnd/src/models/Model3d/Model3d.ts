export type ResponseDto<T> = {
  statusCode: number;
  message: string;
  data: T;
};

export type DataDto<T> = {
  id: number;
  vehicleCategoryId: number;
  vehicleModel3DUrl: string;
  partCategoryAppointmentViewModels: T[];
};

export type PartCategoryViewModel<T> = {
  partCategoryName: string;
  damagedPartViewModels: T[];
};

export type DamagedPartViewModels = {
  id: number;
  partCategoryId: number;
  partName: string;
  damageLevel: "Minor";
  nodeName: string;
};
