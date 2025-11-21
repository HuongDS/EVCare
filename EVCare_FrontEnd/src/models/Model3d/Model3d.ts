export type ResponseDto<T> = {
  statusCode: number;
  message: string;
  data: T;
};

export type DataDto<T> = {
  id: number;
  vehicleCategoryId: number;
  vehicleModel3DUrl: string;
  scale: {
    x: number;
    y: number;
    z: number;
  };
  partCategoryAppointmentViewModels: T[];
};

export type PartCategoryViewModel<T> = {
  partCategoryName: string;
  damagedPartViewModels: T[];
};

export type PartDamagedModel = {
  id: number;
  partCategoryId: number;
  partName: string;
  damageLevel: string;
  nodeName: string;
};
