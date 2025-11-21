import React from "react";
import InvoiceItem from "./InvoiceItem";
import type { InvoiceViewModel } from "../../../models/Invoice/InvoiceViewModel";

interface Props {
  invoices: InvoiceViewModel[];
}

const InvoiceSection: React.FC<Props> = ({ invoices }) => {
  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Invoices History ({invoices.length})</h2>
        <p
          style={{
            color: "#6b7280",
            fontStyle: "italic",
            fontSize: "0.9rem",
            marginTop: "-5px",
          }}
        >
          These are all the invoices you have paid at EVCare.
        </p>
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
