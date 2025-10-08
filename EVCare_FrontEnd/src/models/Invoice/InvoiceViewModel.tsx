import type { PaymentMethodEnum, PaymentStatusEnum } from "../enums";

export type InvoiceViewModel = {
  id: number;
  appointmentDate: string;
  totalPrice: number;
  paymentMethod: PaymentMethodEnum;
  paymentDate: string;
  status: PaymentStatusEnum;
};
