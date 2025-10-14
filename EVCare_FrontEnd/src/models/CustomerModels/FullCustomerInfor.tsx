import type { VehicleViewDto } from "../VehicleModels/vehicleViewDto";

export type FullCustomerInfor = {
  accountId: number;
  customerName: string;
  email: string;
  phoneNumber: string;
  address: string;
  banned: false;
  vehicles: VehicleViewDto[];
};
