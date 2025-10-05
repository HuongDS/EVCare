import React from "react";
import styled from "styled-components";
import { Calendar, Phone, User, Car, FileText, CreditCard } from "lucide-react";

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  padding: 24px;
  font-family: "Outfit", sans-serif;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const InvoiceWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const InvoiceContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const InvoiceHeader = styled.div`
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  color: white;
  padding: 32px 40px;

  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const CompanyInfo = styled.div`
  h1 {
    font-size: 32px;
    font-weight: 700;
    margin: 0 0 8px 0;
  }

  p {
    margin: 4px 0;
    opacity: 0.9;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 26px;
    }
  }
`;

const InvoiceInfo = styled.div`
  text-align: right;

  h2 {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px 0;
  }

  p {
    margin: 4px 0;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    text-align: left;

    h2 {
      font-size: 24px;
    }
  }
`;

const InvoiceId = styled.div`
  font-size: 18px;
  font-weight: 600;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  display: inline-block;
`;

const InvoiceBody = styled.div`
  padding: 32px 40px;

  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

const CustomerSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid #e0e0e0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const InfoCard = styled.div``;

const CardTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;

  svg {
    color: #666;
    flex-shrink: 0;
  }

  strong {
    font-weight: 600;
    color: #000;
  }
`;

const TableSection = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin: 0 0 16px 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f5f5f5;

  th {
    padding: 12px;
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &:nth-child(2) {
      text-align: center;
    }

    &:nth-child(3),
    &:nth-child(4) {
      text-align: right;
    }
  }

  @media (max-width: 768px) {
    th {
      padding: 10px 8px;
      font-size: 12px;
    }
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #e0e0e0;

    &:last-child {
      border-bottom: none;
    }
  }

  td {
    padding: 14px 12px;
    font-size: 14px;
    color: #333;

    &:nth-child(2) {
      text-align: center;
      font-weight: 600;
    }

    &:nth-child(3),
    &:nth-child(4) {
      text-align: right;
      font-weight: 600;
    }
  }

  @media (max-width: 768px) {
    td {
      padding: 12px 8px;
      font-size: 13px;
    }
  }
`;

const SummarySection = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`;

const SummaryCard = styled.div`
  width: 100%;
  max-width: 400px;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SummaryRow = styled.div<{ $isTotal?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  font-size: ${(props) => (props.$isTotal ? "18px" : "15px")};
  font-weight: ${(props) => (props.$isTotal ? "700" : "500")};
  color: ${(props) => (props.$isTotal ? "#000" : "#333")};

  ${(props) =>
    props.$isTotal &&
    `
    border-top: 2px solid #000;
    margin-top: 8px;
    padding-top: 16px;
  `}

  @media (max-width: 768px) {
    font-size: ${(props) => (props.$isTotal ? "16px" : "14px")};
  }
`;

const PaymentBadge = styled.div<{ $method: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  margin-top: 12px;

  ${(props) =>
    props.$method === "Cash"
      ? `
    background: #e8f5e9;
    color: #2e7d32;
  `
      : `
    background: #e3f2fd;
    color: #1565c0;
  `}
`;

const InvoiceFooter = styled.div`
  padding: 24px 40px;
  background: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  text-align: center;

  p {
    margin: 4px 0;
    font-size: 13px;
    color: #666;
  }

  strong {
    color: #000;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

// Types
interface Part {
  technicianId: number;
  id: number;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

interface OrderData {
  id: number;
  parts: Part[];
  price: number;
}

interface InvoiceData {
  orderId: number;
  total_Price: number;
  payment_Method: "Cash" | "Online";
  order: OrderData;
  customerName?: string;
  licensePlate?: string;
  vehicleModel?: string;
  phoneNumber?: string;
  location?: string;
  date?: string;
  invoiceNumber?: string;
}

interface InvoicePageProps {
  data: InvoiceData;
}

const InvoicePage: React.FC<InvoicePageProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN") + " VND";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleDateString("vi-VN");
    return dateString;
  };

  return (
    <PageContainer>
      <InvoiceWrapper>
        <InvoiceContainer>
          {/* Header */}
          <InvoiceHeader>
            <HeaderTop>
              <CompanyInfo>
                <h1>AutoCare Service</h1>
                <p>123 Main Street, District 1</p>
                <p>Ho Chi Minh City, Vietnam</p>
                <p>Phone: (028) 1234 5678</p>
                <p>Email: info@autocare.vn</p>
              </CompanyInfo>

              <InvoiceInfo>
                <h2>INVOICE</h2>
                <InvoiceId>
                  #{data.invoiceNumber || `INV-${data.orderId}`}
                </InvoiceId>
                <p style={{ marginTop: "12px" }}>
                  Date: {formatDate(data.date)}
                </p>
                <p>Order ID: #{data.orderId}</p>
              </InvoiceInfo>
            </HeaderTop>
          </InvoiceHeader>

          {/* Body */}
          <InvoiceBody>
            {/* Customer Information */}
            <CustomerSection>
              <InfoCard>
                <CardTitle>Bill To</CardTitle>
                <InfoList>
                  <InfoItem>
                    <User size={16} />
                    <span>
                      <strong>{data.customerName || "Customer Name"}</strong>
                    </span>
                  </InfoItem>
                  <InfoItem>
                    <Phone size={16} />
                    <span>{data.phoneNumber || "N/A"}</span>
                  </InfoItem>
                </InfoList>
              </InfoCard>

              <InfoCard>
                <CardTitle>Vehicle Details</CardTitle>
                <InfoList>
                  <InfoItem>
                    <Car size={16} />
                    <span>
                      <strong>{data.vehicleModel || "Vehicle Model"}</strong>
                    </span>
                  </InfoItem>
                  <InfoItem>
                    <FileText size={16} />
                    <span>
                      License Plate:{" "}
                      <strong>{data.licensePlate || "N/A"}</strong>
                    </span>
                  </InfoItem>
                  <InfoItem>
                    <Calendar size={16} />
                    <span>Service Date: {formatDate(data.date)}</span>
                  </InfoItem>
                </InfoList>
              </InfoCard>
            </CustomerSection>

            {/* Parts Table */}
            <TableSection>
              <SectionTitle>Parts & Services</SectionTitle>
              <Table>
                <TableHeader>
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Amount</th>
                  </tr>
                </TableHeader>
                <TableBody>
                  {data.order.parts.map((part) => (
                    <tr key={part.id}>
                      <td>{part.name}</td>
                      <td>{part.quantity}</td>
                      <td>{formatCurrency(part.price)}</td>
                      <td>{formatCurrency(part.price * part.quantity)}</td>
                    </tr>
                  ))}
                </TableBody>
              </Table>
            </TableSection>

            {/* Summary */}
            <SummarySection>
              <SummaryCard>
                <SummaryRow>
                  <span>Subtotal:</span>
                  <span>{formatCurrency(data.order.price)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Tax (0%):</span>
                  <span>{formatCurrency(0)}</span>
                </SummaryRow>
                <SummaryRow $isTotal>
                  <span>Total:</span>
                  <span>{formatCurrency(data.total_Price)}</span>
                </SummaryRow>
                <div style={{ textAlign: "right" }}>
                  <PaymentBadge $method={data.payment_Method}>
                    <CreditCard size={14} />
                    Paid via {data.payment_Method}
                  </PaymentBadge>
                </div>
              </SummaryCard>
            </SummarySection>
          </InvoiceBody>

          {/* Footer */}
          <InvoiceFooter>
            <p>
              <strong>Thank you for your business!</strong>
            </p>
            <p>
              For any questions regarding this invoice, please contact us at
              info@autocare.vn
            </p>
            <p style={{ marginTop: "12px", fontSize: "12px" }}>
              This is a computer-generated invoice and does not require a
              signature.
            </p>
          </InvoiceFooter>
        </InvoiceContainer>
      </InvoiceWrapper>
    </PageContainer>
  );
};

// Demo Component
const InvoiceDemo = () => {
  const mockInvoiceData: InvoiceData = {
    orderId: 1,
    total_Price: 16200000,
    payment_Method: "Cash",
    order: {
      id: 1,
      parts: [
        {
          technicianId: 2,
          id: 1,
          name: "Piston",
          quantity: 12,
          price: 1200000,
          imageUrl: "images/parts/piston.jpg",
        },
        {
          technicianId: 2,
          id: 2,
          name: "Spark Plug",
          quantity: 12,
          price: 150000,
          imageUrl: "images/parts/sparkplug.jpg",
        },
      ],
      price: 16200000,
    },
    customerName: "Picasso",
    licensePlate: "51G-99999",
    vehicleModel: "Vinfast VF5",
    phoneNumber: "0123456789",
    location: "HCM City",
    date: "13/06/2025",
    invoiceNumber: "INV-2025-001",
  };

  return <InvoicePage data={mockInvoiceData} />;
};

export default InvoiceDemo;
