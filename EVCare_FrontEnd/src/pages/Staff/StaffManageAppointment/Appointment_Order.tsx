import React, { useState } from "react";
import styled from "styled-components";
import {
  BanknoteArrowUp,
  Calendar,
  CreditCard,
  ScanQrCode,
} from "lucide-react";
import { useGetOrderDetail } from "../../../services/orderServiceApi";
import type { StaffAppointmentsDto } from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import { formatDate } from "../../../utils/formatDate";

// Types

interface PaymentPageProps {
  data: StaffAppointmentsDto;
  currentStep: number;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ data, currentStep }) => {
  const [note, setNote] = useState(data.note);

  //Gọi api lấy order detail
  const orderDetail = useGetOrderDetail(data.orderId);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN");
  };

  const handlePayment = (method: "online" | "cash" | "PayOS") => {
    alert(`Payment method selected: ${method}`);
    // handleNext();
  };

  return (
    <PageContainer>
      <Container>
        <Header>
          <h1>Oder Details</h1>
        </Header>

        <Content>
          {/* Left Section - Information */}
          <Section>
            <SectionTitle>Information</SectionTitle>

            <AppointmentId>Appointment ID: #{data.id}</AppointmentId>

            <InfoRow>
              <InfoItem>
                <Label>Customer's Name</Label>
                <Value>{data.customerName}</Value>
              </InfoItem>
              <InfoItem>
                <Label>License Plate</Label>
                <Value>{data.licensePlate}</Value>
              </InfoItem>
            </InfoRow>

            <InfoRow>
              <InfoItem>
                <Label>Vehicle Model</Label>
                <Value>{data.vehicleModel}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Phone Number</Label>
                <Value>{data.phoneNumber}</Value>
              </InfoItem>
            </InfoRow>

            <LocationDate>
              <IconText>
                <Calendar size={18} />
                {formatDate(data.appointmentDate)}
              </IconText>
            </LocationDate>

            <ReportBox>
              <ReportLabel>Note From Customer:</ReportLabel>
              <ReportTextarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter technical report..."
              />
            </ReportBox>
          </Section>

          {/* Right Section - Total Product */}
          <Section>
            <SectionTitle>Total Parts</SectionTitle>
            <ProductTable>
              {orderDetail.data?.data?.parts.map((part) => (
                <ProductRow key={part.id}>
                  <ProductName>{part.name}</ProductName>
                  <ProductQuantity>x{part.quantity}</ProductQuantity>
                  <ProductPrice>
                    {formatCurrency(part.price * part.quantity)}
                  </ProductPrice>
                </ProductRow>
              ))}

              <TotalRow>
                <TotalLabel>Total</TotalLabel>
                <div></div>
                <TotalPrice>
                  {formatCurrency(orderDetail.data?.data?.price || 0)}
                </TotalPrice>
              </TotalRow>
            </ProductTable>
          </Section>
        </Content>

        <ButtonGroup>
          <PaymentButton
            $variant="online"
            onClick={() => handlePayment("online")}
          >
            <CreditCard size={22} />
            Online Payment
          </PaymentButton>
          <PaymentButton
            $variant="online"
            onClick={() => handlePayment("PayOS")}
          >
            <ScanQrCode size={22} />
            PayOS
          </PaymentButton>
          <PaymentButton
            $variant="online"
            onClick={() => handlePayment("cash")}
          >
            <BanknoteArrowUp size={22} />
            Cash
          </PaymentButton>
        </ButtonGroup>
      </Container>
    </PageContainer>
  );
};

export default PaymentPage;

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%);
  padding: 24px;
  border-radius: 20px;
  font-family: "Outfit", sans-serif;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 50px 50px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  @media (max-width: 768px) {
    border-radius: 16px;
  }
`;

const Header = styled.div`
  text-align: center;
  padding: 15px 15px;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(135deg, #00c853 0%, #00a043 100%);

  h1 {
    font-size: 32px;
    font-weight: 700;
    color: white;
    margin: 0;
  }

  @media (max-width: 768px) {
    padding: 24px 20px 20px;

    h1 {
      font-size: 26px;
    }
  }
`;

const Content = styled.div`
  padding: 32px 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 24px 20px;
    gap: 28px;
  }
`;

const Section = styled.div``;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #000;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e0e0e0;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 16px;
  }
`;

const AppointmentId = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1a237e;
  margin-bottom: 20px;
  padding: 12px;
  background: #e8eaf6;
  border-radius: 8px;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 16px;
  }
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const InfoItem = styled.div``;

const Label = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
  font-weight: 500;
`;

const Value = styled.div`
  font-size: 16px;
  color: #000;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const LocationDate = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const IconText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #000;

  svg {
    color: #666;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ReportBox = styled.div`
  margin-top: 20px;
`;

const ReportLabel = styled.div`
  font-size: 14px;
  color: #000;
  font-weight: 600;
  margin-bottom: 8px;
`;

const ReportTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: "Outfit", sans-serif;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #2196f3;
  }

  @media (max-width: 768px) {
    min-height: 100px;
  }
`;

const ProductTable = styled.div`
  margin-top: 16px;
`;

const ProductRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 15px;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    gap: 8px;
  }
`;

const ProductName = styled.div`
  color: #000;
  font-weight: 500;
`;

const ProductQuantity = styled.div`
  color: #666;
  text-align: center;
`;

const ProductPrice = styled.div`
  color: #000;
  font-weight: 600;
  text-align: right;
`;

const TotalRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 12px;
  padding: 16px 0 0;
  margin-top: 12px;
  border-top: 2px solid #000;
  font-size: 18px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 16px;
    gap: 8px;
  }
`;

const TotalLabel = styled.div`
  color: #000;
`;

const TotalPrice = styled.div`
  color: #000;
  text-align: right;
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  padding: 32px 40px;
  border-top: 1px solid #e0e0e0;

  @media (max-width: 768px) {
    padding: 24px 20px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const PaymentButton = styled.button<{ $variant?: "online" | "cash" }>`
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Outfit", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${(props) =>
    props.$variant === "online"
      ? `
    background: white;
    color: #00c853;
    border: 3px solid #00c853;

    &:hover {
      background: #f1f8f4;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 200, 83, 0.2);
    }
  `
      : `
    background: #00c853;
    color: white;

    &:hover {
      background: #00a043;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 200, 83, 0.3);
    }
  `}

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 14px 20px;
    font-size: 16px;
  }
`;
