import type { PaymentMethodEnum, PaymentStatusEnum } from "../enums";

export type InvoiceViewModel = {
  id: number;
  appointmentDate: string;
  totalPrice: number;
  paymentMethod: PaymentMethodEnum;
  paymentDate: string;
  status: PaymentStatusEnum;
};

export type DataDto<T> = {
  id: number;
  paymentDate: string;
  subTotal: number;
  vat: number;
  total: number;
  paymentStatus: PaymentStatusEnum;
  partItems: T;
};
