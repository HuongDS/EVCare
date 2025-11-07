import { useCallback, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Card, Divider, Button, Tag } from "antd";
import {
  CreditCardOutlined,
  DollarOutlined,
  QrcodeOutlined,
  CalendarOutlined,
  PhoneOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { useGetOrderDetail } from "../../../services/orderServiceApi";
import type { AppointmentDetailModel } from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import { formatDate } from "../../../utils/formatDate";
import type {
  TechnicianModel,
  TechnicianSkills,
} from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { useHandlePayment } from "../../../services/PaymentServiceApi";
import { handleError } from "../../../utils/errorHandler";
import { formatCurrency } from "../../../utils/formatCurrency";
import { useQueryClient } from "@tanstack/react-query";
import SpinnerComponent from "../../../components/SpinnerComponent";
import CancelPaymentButton from "../StaffComponents/CancelPaymentButton";
import { useStaffDashboardHub } from "../../../hooks/useStaffHub";
import {
  MSG_TITLE,
  SUCCESS_MESSAGE,
} from "../../../constants/messages/Message";
import { useNotification } from "../../../context/useNotification";
import ColorSpinner from "../StaffComponents/ColorSpinner";
import TextWaitingEffect from "../StaffComponents/TextWaitingEffect";

interface PaymentPageProps {
  data: AppointmentDetailModel<TechnicianModel<TechnicianSkills>>;
  onPaymentSuccess: () => void;
}

const PaymentPage = ({ data, onPaymentSuccess }: PaymentPageProps) => {
  const [paymentMethod, setPaymentMethod] = useState<
    "VnPay" | "PayOs" | "Cash"
  >();
  const [vnPayPending, setVnPayPending] = useState(false);
  const [qrcode, setQrCode] = useState("");
  const { data: orderDetail } = useGetOrderDetail(data.orderId);
  const queryClient = useQueryClient();
  const notification = useNotification();

  useStaffDashboardHub<string>((type) => {
    if (type === "InvoiceComplete") {
      notification.success({
        message: MSG_TITLE.PAYMENT,
        description: SUCCESS_MESSAGE.PAID_SUCCESSFULLY,
        showProgress: true,
      });
      onPaymentSuccess();
    }
  });

  const handlePayment = async () => {
    try {
      const response = await handlePaymentMethod();

      if (paymentMethod === "PayOs" && response?.data) {
        return;
      }

      if (paymentMethod === "VnPay") {
        setVnPayPending(true);
      }

      await queryClient.invalidateQueries({
        queryKey: ["Invoice", orderDetail?.data?.id],
      });
    } catch (error) {
      handleError(error);
    }
  };

  //lấy qr code
  const { mutateAsync: payment, isPending } = useHandlePayment();
  const handlePaymentMethod = useCallback(async () => {
    try {
      const response = await payment({
        orderId: orderDetail?.data?.id || 0,
        total_Price: orderDetail?.data?.price || 0,
        payment_Method: paymentMethod || "N/A",
      });
      if (paymentMethod === "PayOs" && response.data !== null) {
        setQrCode(response?.data || "");
      }
      return response;
    } catch (error) {
      handleError(error);
      notification.error({
        message: (error as Error).message,
        showProgress: true,
      });
    }
  }, [orderDetail?.data?.id, orderDetail?.data?.price, paymentMethod]);

  const subtotal =
    orderDetail?.data?.parts.reduce(
      (sum, part) => sum + (part.price + part.replacementPrice) * part.quantity,
      0
    ) ?? 0;

  const vatAmount = (subtotal * (orderDetail?.data?.vat ?? 0)) / 100;

  const calculateTotal = () => {
    return subtotal + vatAmount;
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <h1>Payment & Checkout</h1>
          <AppointmentTag>Appointment #{data.id}</AppointmentTag>
        </Header>

        <MainContent>
          <StyledCard title="Customer Information" size="small">
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Name</InfoLabel>
                <InfoValue>{data.customerName}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>
                  <PhoneOutlined /> Phone
                </InfoLabel>
                <InfoValue>{data.phoneNumber ?? "default"}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>
                  <CarOutlined /> License Plate
                </InfoLabel>
                <InfoValue>{data.vehiclePlateNumber}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Vehicle Model</InfoLabel>
                <InfoValue>{data.vehicleName}</InfoValue>
              </InfoItem>
              <InfoItem style={{ gridColumn: "1 / -1" }}>
                <InfoLabel>
                  <CalendarOutlined /> Appointment Date
                </InfoLabel>
                <InfoValue>
                  {formatDate(data.appointmentDate.toString())}
                </InfoValue>
              </InfoItem>
            </InfoGrid>
          </StyledCard>

          <StyledCard title="Order Summary" size="small">
            <TableSection>
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
                  {orderDetail?.data?.parts.map((part) => (
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
            </TableSection>

            <Divider style={{ margin: "16px 0" }} />
            <TotalRow>
              <TotalLabel>VAT ({orderDetail?.data?.vat ?? 0}%)</TotalLabel>
              <TotalAmount>{formatCurrency(vatAmount)}</TotalAmount>
            </TotalRow>
            <Divider style={{ margin: "16px 0" }} />

            <TotalRow>
              <TotalLabel>Total Amount</TotalLabel>
              <TotalAmount>{formatCurrency(calculateTotal())}</TotalAmount>
            </TotalRow>
          </StyledCard>

          <StyledCard title="Select Payment Method" size="small">
            <PaymentButtons>
              <PaymentBtn
                size="large"
                icon={<CreditCardOutlined />}
                $selected={paymentMethod === "VnPay"}
                onClick={() => setPaymentMethod("VnPay")}
                disabled={data.status === "InProgress"}
              >
                VNPay
              </PaymentBtn>
              <PaymentBtn
                size="large"
                icon={<QrcodeOutlined />}
                $selected={paymentMethod === "PayOs"}
                onClick={() => setPaymentMethod("PayOs")}
                disabled={data.status === "InProgress"}
              >
                PayOS
              </PaymentBtn>
              <PaymentBtn
                size="large"
                icon={<DollarOutlined />}
                $selected={paymentMethod === "Cash"}
                onClick={() => setPaymentMethod("Cash")}
                disabled={data.status === "InProgress"}
              >
                Cash
              </PaymentBtn>
            </PaymentButtons>

            {paymentMethod === "PayOs" && (
              <QRSection>
                {isPending ? (
                  <ColorSpinner width="6em" height="6em" />
                ) : (
                  <iframe src={qrcode} />
                )}
                <QRInfo>
                  <p>Scan QR code to complete payment</p>
                  <AmountTag>
                    Amount: {formatCurrency(calculateTotal())}
                  </AmountTag>
                </QRInfo>
              </QRSection>
            )}

            {vnPayPending && (
              <PaymentCard>
                <FlexContainer>
                  <Spinner />
                  <TextContainer>
                    <MainText>Awaiting Payment</MainText>
                    <Description>
                      Payment instructions have been sent to customer email via
                      VNPay
                    </Description>
                    <HintText>Wait for completing appointment</HintText>
                  </TextContainer>
                  <CancelPaymentButton onclick={() => setVnPayPending(false)} />
                </FlexContainer>
              </PaymentCard>
            )}
          </StyledCard>
        </MainContent>

        <Footer>
          <ConfirmButton
            type="primary"
            size="large"
            onClick={handlePayment}
            disabled={!paymentMethod}
          >
            {isPending ? (
              <div style={{ textAlign: "center" }}>
                <TextWaitingEffect
                  text="Waiting for processing"
                  fontSize="20px"
                />
              </div>
            ) : (
              <text>Confirm Payment</text>
            )}
          </ConfirmButton>
        </Footer>
      </ContentWrapper>
    </PageContainer>
  );
};

export default PaymentPage;

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #3bf695 0%, #00ab66 100%);
  padding: 32px 20px;
  border-radius: 20px;
  * {
    font-family: "Outfit", sans-serif !important;
  }
`;

const ContentWrapper = styled.div`
  max-width: 90%;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
  padding: 24px 32px;
  background: linear-gradient(135deg, #1da1f2 0%, #1877f2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;

    h1 {
      font-size: 24px;
    }
  }
`;

const AppointmentTag = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
`;

const MainContent = styled.div`
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .ant-card-head {
    background: #f8f9fa;
    font-weight: 700;
    font-size: 16px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const InfoValue = styled.div`
  font-size: 15px;
  color: #333;
  font-weight: 600;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalLabel = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #333;
`;

const TotalAmount = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
`;

const PaymentButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PaymentBtn = styled(Button)<{ $selected: boolean }>`
  height: 64px !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  font-size: 15px !important;
  transition: all 0.3s ease !important;

  ${(props) =>
    props.$selected
      ? `
    background: #667eea !important;
    color: white !important;
    border-color: #667eea !important;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
    transform: translateY(-2px);
  `
      : `
    background: white !important;
    color: #667eea !important;
    border: 2px solid #667eea !important;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2) !important;
    }
    
    &:disabled {
    opacity: 0.6 !important;
    pointer-events: none !important;
    background: #f0f0f0 !important;
    color: #999 !important;
    border-color: #ddd !important;
    box-shadow: none !important;
    transform: none !important;
    }
  `}
`;

const QRSection = styled.div`
  margin-top: 24px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  iframe {
    width: 100%;
    height: 60vh;
  }
`;

const QRInfo = styled.div`
  text-align: center;

  p {
    margin: 0 0 8px 0;
    color: #666;
    font-size: 14px;
  }
`;

const AmountTag = styled(Tag)`
  font-size: 16px !important;
  padding: 8px 16px !important;
  font-weight: 700 !important;
  background: #667eea !important;
  color: white !important;
  border: none !important;
`;

const Footer = styled.div`
  display: flex;
  gap: 10px;
  padding: 24px 32px;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ConfirmButton = styled(Button)`
  width: 100%;
  height: 56px !important;
  font-size: 18px !important;
  font-weight: 700 !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;

  &:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5) !important;
  }

  &:disabled {
    background: #e0e0e0 !important;
    box-shadow: none !important;
    transform: none !important;
  }
`;

const TableSection = styled.div`
  margin-bottom: 32px;
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
    &:nth-child(4),
    &:nth-child(5) {
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
    &:nth-child(4),
    &:nth-child(5) {
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

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const PaymentCard = styled.div`
  margin-top: 10px;
  padding: 16px;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #3b82f6;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-top: 2px;
  flex-shrink: 0;
`;

const TextContainer = styled.div`
  flex: 1;
`;

const MainText = styled.p`
  font-size: 14px;
  color: #1e3a8a;
  font-weight: 600;
  margin: 0 0 4px 0;
`;

const Description = styled.p`
  font-size: 14px;
  color: #1e40af;
  margin: 0 0 8px 0;
`;

const HintText = styled.p`
  font-size: 12px;
  color: #2563eb;
  margin: 0;
`;
