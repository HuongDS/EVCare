import React from "react";
import { Result } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
  padding: 24px;
  * {
    font-family: "Outfit", sans-serif;
  }
`;

const Card = styled.div`
  background: white;
  padding: 10px 48px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 600px;
  width: 100%;
`;

const Amount = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #52c41a;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  color: #8c8c8c;
`;

const Value = styled.span`
  color: #262626;
  font-weight: 500;
`;

const Payment_Success_Page: React.FC = () => {
  const paymentDetails = {
    amount: "1,500,000 VND",
    orderId: "ORD123456789",
    transactionId: "TRX987654321",
    paymentMethod: "Credit Card",
    date: new Date().toLocaleString(),
  };

  return (
    <Container>
      <Card>
        <Result
          icon={
            <CheckCircleFilled style={{ color: "#52c41a", fontSize: 72 }} />
          }
          title="Payment Successful!"
          subTitle="Your payment has been processed successfully"
        />

        <Amount>{paymentDetails.amount}</Amount>

        <div style={{ margin: "32px 0" }}>
          <DetailItem>
            <Label>Order ID</Label>
            <Value>{paymentDetails.orderId}</Value>
          </DetailItem>
          <DetailItem>
            <Label>Payment Method</Label>
            <Value>{paymentDetails.paymentMethod}</Value>
          </DetailItem>
          <DetailItem>
            <Label>Date & Time</Label>
            <Value>{paymentDetails.date}</Value>
          </DetailItem>
        </div>
      </Card>
    </Container>
  );
};

export default Payment_Success_Page;
