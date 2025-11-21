import type { VehicleViewDto } from "../VehicleModels/vehicleViewDto";

export type FullCustomerInfor = {
  accountId: number;
  customerId: number;
  customerName: string;
  email: string;
  phoneNumber: string;
  address: string;
  banned: boolean;
  vehicles: VehicleViewDto[];
};
