import React from "react";
import type {InvoiceViewModel} from "../../../models/Invoice/InvoiceViewModel";

interface Props {
    invoice: InvoiceViewModel;
}

function formatDate(dateString?: string): string {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

const InvoiceItem: React.FC<Props> = ({invoice}) => {
    return (
        <div className="invoice-item" style={{animation: "fadeInUp 0.5s ease-out"}}>
            <div className="invoice-field">
                <div className="invoice-label">Appointment Date</div>
                <div className="invoice-value">{formatDate(invoice.appointmentDate)}</div>
            </div>

            <div className="invoice-field">
                <div className="invoice-label">Total Amount</div>
                <div className="invoice-amount">{invoice.totalPrice.toFixed(0)} VND</div>
            </div>

            <div className="invoice-field">
                <div className="invoice-label">Payment Date</div>
                <div className="invoice-value">{formatDate(invoice.paymentDate)}</div>
            </div>

            <div className="invoice-field">
                <div className="invoice-label">Status</div>
                <span className={`status-badge status-${invoice.status.toLowerCase()}`}>{invoice.status}</span>
            </div>

            <div className="invoice-field">
                <div className="invoice-label">Payment Method</div>
                <div className="payment-method">
                    {/* <span className="payment-icon">{getPaymentMethodIcon(invoice.paymentMethod)}</span> */}
                    <span>{invoice.paymentMethod}</span>
                </div>
            </div>
        </div>
    );
};

export default InvoiceItem;
