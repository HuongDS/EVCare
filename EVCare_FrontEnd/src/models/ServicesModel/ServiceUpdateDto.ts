export type ServiceUpdateDto = {
  name: string;
  description: string;
  duration: number;
  serviceCategoryId: number;
  partsIds: number[];
  id: number;
};
