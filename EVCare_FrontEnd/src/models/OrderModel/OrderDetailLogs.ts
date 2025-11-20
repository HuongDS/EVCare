export type OrderDetailLogs = {
  orderId: number;
  parts: PartLogDetails[];
};

export type PartLogDetails = {
  partId: number;
  partName: number;
  message: string[];
};
