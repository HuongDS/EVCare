import { Calendar, Phone, User, Car, FileText, CreditCard } from "lucide-react";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";
import {
  useDownloadInvoice,
  useGetInvoice,
} from "../../../services/invoicesService";
import type { AppointmentDetailModel } from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import type {
  TechnicianModel,
  TechnicianSkills,
} from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { useGetOrderDetail } from "../../../services/orderServiceApi";
import { DownloadButton } from "../../../components/Button/DownloadButton";
import SpinnerComponent from "../../../components/SpinnerComponent";
import ShowButton from "../../../components/Button/ShowButton";
import { useState } from "react";

type InvoicePageProps = {
  data: AppointmentDetailModel<TechnicianModel<TechnicianSkills>>;
};

export const InvoicePage = ({ data }: InvoicePageProps) => {
  const [showDetail, setShowDetail] = useState(false);
  const { data: orderDetail } = useGetOrderDetail(data.orderId);
  const { data: invoice, isFetching } = useGetInvoice(
    orderDetail?.data?.id ?? 0
  );

  //gộp các item cùng id
  const mergeOrder =
    orderDetail?.data?.parts.reduce((acc, part) => {
      if (acc[part.id]) {
        acc[part.id].quantity += part.quantity;
        acc[part.id].price += part.price;
        acc[part.id].replacementPrice += part.replacementPrice;
      } else {
        acc[part.id] = { ...part };
      }
      return acc;
    }, {} as Record<number, (typeof orderDetail.data.parts)[0]>) || {};

  // Chuyển object thành array
  const mergedPartsArray = Object.values(mergeOrder);

  //tính các chi phí trong order
  const subtotal =
    orderDetail?.data?.parts.reduce(
      (sum, part) => sum + (part.price + part.replacementPrice) * part.quantity,
      0
    ) ?? 0;

  const vatAmount = (subtotal * (orderDetail?.data?.vat ?? 0)) / 100;

  const calculateTotal = () => {
    return subtotal + vatAmount;
  };

  //hàm tải invoice
  const { refetch, isLoading } = useDownloadInvoice(orderDetail?.data?.id ?? 0);

  const handleDownloadInvoice = async () => {
    const { data: url } = await refetch();
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${orderDetail?.data?.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };
  return (
    <PageContainer>
      <InvoiceWrapper>
        {isLoading && isFetching ? (
          <SpinStyled>
            <SpinnerComponent />
          </SpinStyled>
        ) : (
          <div
            style={{
              width: "20%",
            }}
          >
            <DownloadButton
              action={handleDownloadInvoice}
              text="Print Invoice"
            />
          </div>
        )}
        <InvoiceContainer>
          <InvoiceHeader>
            <HeaderTop>
              <CompanyInfo>
                <h1>EVCare Service</h1>
                <p>123 Main Street, District 1</p>
                <p>Ho Chi Minh City, Vietnam</p>
                <p>Phone: (+84) 9123456789</p>
                <p>Email: info@evcare.vn</p>
              </CompanyInfo>

              <InvoiceInfo>
                <h2>INVOICE</h2>
                <InvoiceId>#{invoice?.data?.id}</InvoiceId>
                <p style={{ marginTop: "12px" }}>
                  Date: {formatDate(invoice?.data?.paymentDate || "")}
                </p>
                <p>Order ID: #{data.orderId}</p>
              </InvoiceInfo>
            </HeaderTop>
          </InvoiceHeader>

          <InvoiceBody>
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
                      <strong>{data.vehicleName || "Vehicle Model"}</strong>
                    </span>
                  </InfoItem>
                  <InfoItem>
                    <FileText size={16} />
                    <span>
                      License Plate:{" "}
                      <strong>{data.vehiclePlateNumber || "N/A"}</strong>
                    </span>
                  </InfoItem>
                  <InfoItem>
                    <Calendar size={16} />
                    <span>
                      Service Date:{" "}
                      {formatDate(data.appointmentDate.toString())}
                    </span>
                  </InfoItem>
                </InfoList>
              </InfoCard>
            </CustomerSection>

            <TableSection>
              <SectionTitle>
                Parts & Services
                {showDetail ? (
                  <ShowButton
                    text="Invoice"
                    onclick={() => setShowDetail(false)}
                  />
                ) : (
                  <ShowButton
                    text="Order Detail"
                    onclick={() => setShowDetail(true)}
                  />
                )}
              </SectionTitle>
              {showDetail ? (
                <Table>
                  <TableHeaderOrder>
                    <tr>
                      <th>Description</th>
                      <th>Order By</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Service Price</th>
                      <th>Amount</th>
                    </tr>
                  </TableHeaderOrder>
                  <TableBodyOrder>
                    {orderDetail?.data?.parts?.map((part) => (
                      <tr key={part.id}>
                        <td>{part.name}</td>
                        <td>{part.technicianName}</td>
                        <td>{part.quantity}</td>
                        <td>{formatCurrency(part.price)}</td>
                        <td>{formatCurrency(part.replacementPrice)}</td>
                        <td>
                          {formatCurrency(
                            (part.price + part.replacementPrice) * part.quantity
                          )}
                        </td>
                      </tr>
                    ))}
                  </TableBodyOrder>
                </Table>
              ) : (
                <Table>
                  <TableHeader>
                    <tr>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Service Price</th>
                      <th>Amount</th>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {mergedPartsArray?.map((part) => (
                      <tr key={part.id}>
                        <td>{part.name}</td>
                        <td>{part.quantity}</td>
                        <td>{formatCurrency(part.price)}</td>
                        <td>{formatCurrency(part.replacementPrice)}</td>
                        <td>
                          {formatCurrency(
                            (part.price + part.replacementPrice) * part.quantity
                          )}
                        </td>
                      </tr>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableSection>

            <SummarySection>
              <SummaryCard>
                <SummaryRow>
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>VAT ({orderDetail?.data?.vat}%):</span>
                  <span>{formatCurrency(vatAmount)}</span>
                </SummaryRow>
                <SummaryRow $isTotal>
                  <span>Total:</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </SummaryRow>
                <div style={{ textAlign: "right" }}>
                  <PaymentBadge $method={invoice?.data?.paymentMethod || "N/A"}>
                    <CreditCard size={14} />
                    Paid via {invoice?.data?.paymentMethod || "N/A"}
                  </PaymentBadge>
                </div>
              </SummaryCard>
            </SummarySection>
          </InvoiceBody>

          <InvoiceFooter>
            <p>
              <strong>Thank you for choosing us!</strong>
            </p>
            <p>
              For any questions regarding this invoice, please contact us at
              info@evcare.vn
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

import {
  PageContainer,
  InvoiceWrapper,
  InvoiceContainer,
  InvoiceHeader,
  HeaderTop,
  CompanyInfo,
  InvoiceInfo,
  InvoiceId,
  InvoiceBody,
  CustomerSection,
  InfoCard,
  CardTitle,
  InfoList,
  InfoItem,
  TableSection,
  SectionTitle,
  Table,
  TableHeaderOrder,
  TableBodyOrder,
  TableHeader,
  TableBody,
  SummarySection,
  SummaryCard,
  SummaryRow,
  PaymentBadge,
  InvoiceFooter,
  SpinStyled,
} from "./styles/Appointment_Invoice.styled";
