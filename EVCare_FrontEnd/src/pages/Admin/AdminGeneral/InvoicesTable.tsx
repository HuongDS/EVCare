import React from "react";
import type { InvoiceViewModel } from "../../../models/Invoice/InvoiceViewModel";
import { formatDate } from "../../../utils/formatDate";

interface Props {
  listInvoices: InvoiceViewModel[];
}

const OrdersTable: React.FC<Props> = ({ listInvoices }: Props) => {
  return (
    <div className="orders-card">
      <div className="orders-header">
        <h2 className="orders-title">Recent Invoices</h2>
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Date</th>
            <th>Payment Method</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {listInvoices.map((o, i) => (
            <tr key={o.id}>
              <td>
                <span className="order-number">{++i}</span>
              </td>
              <td>{formatDate(o.appointmentDate)}</td>
              <td>{o.paymentMethod}</td>
              <td>
                <span className={`status-badge status-${o.status.toLowerCase()}`}>{o.status}</span>
              </td>
              <td>{o.totalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
