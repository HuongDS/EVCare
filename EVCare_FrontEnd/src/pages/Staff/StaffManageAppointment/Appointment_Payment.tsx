import { useCallback, useState } from "react";
import { Divider } from "antd";
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
import CancelPaymentButton from "../StaffComponents/CancelPaymentButton";
import { useStaffDashboardHub } from "../../../hooks/useStaffHub";
import { useNotification } from "../../../context/useNotification";
import ColorSpinner from "../StaffComponents/ColorSpinner";
import TextWaitingEffect from "../StaffComponents/TextWaitingEffect";

interface PaymentPageProps {
  data: AppointmentDetailModel<TechnicianModel<TechnicianSkills>>;
  onPaymentSuccess: () => void;
}

export default function Appointment_Payment({
  data,
  onPaymentSuccess,
}: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<
    "VnPay" | "PayOs" | "Cash"
  >();
  const [vnPayPending, setVnPayPending] = useState(false);
  const [qrcode, setQrCode] = useState("");
  const [openQrCode, setOpenQrcode] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { data: orderDetail } = useGetOrderDetail(data.orderId);
  const queryClient = useQueryClient();
  const notification = useNotification();

  useStaffDashboardHub<string>((type) => {
    if (type === "InvoiceComplete") {
      setIsSuccess(true);
    }
  });

  const handlePayment = async () => {
    try {
      const response = await handlePaymentMethod();

      if (paymentMethod === "PayOs" && response?.data) {
        setOpenQrcode(true);
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

            {paymentMethod === "PayOs" && openQrCode && (
              <QRSection>
                {isPending ? (
                  <ColorSpinner width="6em" height="6em" />
                ) : (
                  <iframe title="PayOS QR Code" src={qrcode} />
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
                  <ColorSpinner width="3em" height="3em" />
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
      {isSuccess && (
        <SuccessModal
          header="Appointment Payment"
          message="Appointment is paid successfully"
          action={onPaymentSuccess}
        />
      )}
    </PageContainer>
  );
}

import {
  AmountTag,
  AppointmentTag,
  ConfirmButton,
  ContentWrapper,
  Description,
  FlexContainer,
  Footer,
  Header,
  HintText,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  MainContent,
  MainText,
  PageContainer,
  PaymentBtn,
  PaymentButtons,
  PaymentCard,
  QRInfo,
  QRSection,
  StyledCard,
  Table,
  TableBody,
  TableHeader,
  TableSection,
  TextContainer,
  TotalAmount,
  TotalLabel,
  TotalRow,
} from "./styles/Appointment_Payment.styled";
import SuccessModal from "../../../components/StatusModal/SuccessModal";
