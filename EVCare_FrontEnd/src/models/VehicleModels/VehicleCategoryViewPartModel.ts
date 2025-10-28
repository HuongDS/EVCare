export type VehicleCategoryViewPartModel = {
  id: number;
  name: string;
  model3DUrl: string;
  partCategoryNames: PartModel[];
};

export type PartModel = {
  id: number;
  name: string;
};
