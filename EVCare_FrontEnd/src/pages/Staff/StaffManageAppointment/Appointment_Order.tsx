import { useCallback, useState } from "react";
import styled from "styled-components";
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
import type { StaffAppointmentsDto } from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import { formatDate } from "../../../utils/formatDate";
import type {
  TechnicianModel,
  TechnicianSkills,
} from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { usePayByPayOS } from "../../../services/PaymentServiceApi";
import { handleError } from "../../../utils/errorHandler";
import { formatCurrency } from "../../../utils/formatCurrency";
import { changeAppointmentStatus } from "../../../services/appointmentServiceApi";
import { useAppDispatch } from "../../../states/store";
import { setStep } from "../../../states/appointmentSlice";

interface PaymentPageProps {
  data: StaffAppointmentsDto<TechnicianModel<TechnicianSkills>>;
  currentStep: number;
}

const PaymentPage = ({ data, currentStep }: PaymentPageProps) => {
  const [paymentMethod, setPaymentMethod] = useState<
    "VnPay" | "PayOs" | "Cash"
  >();
  const [qrcode, setQrCode] = useState("");
  const { data: orderDetail } = useGetOrderDetail(data.orderId);
  const dispatch = useAppDispatch();

  const handlePayment = async () => {
    await changeAppointmentStatus({
      appointmentId: data.id,
      status: "Done",
    });
    dispatch(setStep({ id: data.id, step: currentStep + 2 }));
  };

  const totalAmount = orderDetail?.data?.price || 0;
  const mutation = usePayByPayOS();

  //lấy qr code
  const handleGetQRCode = useCallback(async () => {
    try {
      const response = await mutation.mutateAsync({
        orderId: data.orderId,
        total_Price: totalAmount,
        payment_Method: "payOs",
      });
      if (response.data) {
        setQrCode(response.data);
        console.log(response.data);
        setPaymentMethod("PayOs");
      }
    } catch (error) {
      handleError(error);
      alert(error);
    }
  }, [[data.orderId, totalAmount]]);

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <h1>Payment & Checkout</h1>
          <AppointmentTag>Appointment #{data.id}</AppointmentTag>
        </Header>

        <MainContent>
          {/* Customer Info */}
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
                <InfoValue>{data.phoneNumber}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>
                  <CarOutlined /> License Plate
                </InfoLabel>
                <InfoValue>{data.licensePlate}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Vehicle Model</InfoLabel>
                <InfoValue>{data.vehicleModel}</InfoValue>
              </InfoItem>
              <InfoItem style={{ gridColumn: "1 / -1" }}>
                <InfoLabel>
                  <CalendarOutlined /> Appointment Date
                </InfoLabel>
                <InfoValue>{formatDate(data.appointmentDate)}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </StyledCard>

          {/* Parts & Total */}
          <StyledCard title="Order Summary" size="small">
            <PartsTable>
              {orderDetail?.data?.parts.map((part) => (
                <PartRow key={part.id}>
                  <PartName>{part.name}</PartName>
                  <PartQty>×{part.quantity}</PartQty>
                  <PartPrice>
                    {formatCurrency(part.price * part.quantity)}
                  </PartPrice>
                </PartRow>
              ))}
            </PartsTable>

            <Divider style={{ margin: "16px 0" }} />

            <TotalRow>
              <TotalLabel>Total Amount</TotalLabel>
              <TotalAmount>{formatCurrency(totalAmount)}</TotalAmount>
            </TotalRow>
          </StyledCard>

          {/* Payment Methods */}
          <StyledCard title="Select Payment Method" size="small">
            <PaymentButtons>
              <PaymentBtn
                size="large"
                icon={<CreditCardOutlined />}
                $selected={paymentMethod === "VnPay"}
                onClick={() => setPaymentMethod("VnPay")}
              >
                VNPay
              </PaymentBtn>
              <PaymentBtn
                size="large"
                icon={<QrcodeOutlined />}
                $selected={paymentMethod === "PayOs"}
                onClick={handleGetQRCode}
              >
                PayOS
              </PaymentBtn>
              <PaymentBtn
                size="large"
                icon={<DollarOutlined />}
                $selected={paymentMethod === "Cash"}
                onClick={() => setPaymentMethod("Cash")}
              >
                Cash
              </PaymentBtn>
            </PaymentButtons>

            {/* QR Code Display */}
            {paymentMethod === "PayOs" && (
              <QRSection>
                <iframe src={qrcode} />
                {/* <CountdownTimer onTimeUp={handleGetQRCode} /> */}
                <QRInfo>
                  <p>Scan QR code to complete payment</p>
                  <AmountTag>Amount: {formatCurrency(totalAmount)}</AmountTag>
                </QRInfo>
              </QRSection>
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
            Confirm Payment
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

const PartsTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PartRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr;
  gap: 12px;
  padding: 8px 0;
  font-size: 14px;
`;

const PartName = styled.div`
  color: #333;
  font-weight: 500;
`;

const PartQty = styled.div`
  color: #666;
  text-align: center;
`;

const PartPrice = styled.div`
  color: #333;
  font-weight: 600;
  text-align: right;
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
