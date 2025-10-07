import React from "react";
import InvoiceItem from "./InvoiceItem";
import type { InvoiceViewModel } from "../../../models/Invoice/InvoiceViewModel";

interface Props {
  invoices: InvoiceViewModel[];
}

const InvoiceSection: React.FC<Props> = ({ invoices }) => {
  return (
    <div className="profile-card invoices-section">
      <div className="section-header">
        <h2 className="section-title">Invoice History</h2>
      </div>

      <div className="invoices-list" id="invoicesList">
        {invoices.length > 0 ? (
          invoices.map((inv) => <InvoiceItem key={inv.id} invoice={inv} />)
        ) : (
          <div className="no-invoices">No invoices found.</div>
        )}
      </div>
    </div>
  );
};

export default InvoiceSection;
