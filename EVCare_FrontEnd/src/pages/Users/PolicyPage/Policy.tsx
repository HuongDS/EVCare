import React from "react";
import styled from "styled-components";
import { Typography, Divider, Card } from "antd";
import {
  Shield,
  FileCheck,
  Clock,
  CreditCard,
  UserCheck,
  HelpCircle,
} from "lucide-react";

const { Title, Paragraph } = Typography;

const Container = styled.div`
  background: #ffffff;
  min-height: 100vh;
  * {
    font-family: "Outfit", sans-serif;
  }
`;

const Hero = styled.div`
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>');
    opacity: 0.4;
  }

  h1 {
    color: #ffffff;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
    position: relative;
    z-index: 1;
  }

  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
    position: relative;
    z-index: 1;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const PolicyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const PolicyCard = styled(Card)`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: none;
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
  }

  .ant-card-head {
    border-bottom: 1px solid #f3f4f6;
    padding: 1.25rem 1.5rem;
  }

  .ant-card-head-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.05rem;
    font-weight: 600;
    color: #1e293b;
    padding: 0;
  }

  .ant-card-body {
    padding: 1.5rem;
  }
`;

const IconWrapper = styled.div`
  background: #eff6ff;
  padding: 0.625rem;
  border-radius: 8px;
  display: inline-flex;
  color: #3b82f6;
  flex-shrink: 0;
`;

const AdditionalInfo = styled.div`
  max-width: 800px;
  margin: 3rem auto 0;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;

  h3 {
    color: #1e293b;
    font-size: 1.25rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  p {
    color: #475569;
    line-height: 1.7;
    margin: 0;
  }
`;

const StyledDivider = styled(Divider)`
  margin: 3rem 0;
  border-color: #e5e7eb;
`;

const PolicyPage: React.FC = () => {
  const policies = [
    {
      icon: <Shield size={22} />,
      title: "Service Quality Guarantee",
      content:
        "We guarantee the quality of our services. If you're not satisfied, we'll make it right.",
    },
    {
      icon: <FileCheck size={22} />,
      title: "Booking Policy",
      content:
        "Appointments can be rescheduled up to 24 hours before the scheduled time without any penalty.",
    },
    {
      icon: <Clock size={22} />,
      title: "Service Time",
      content:
        "Our service hours are from 8:00 AM to 6:00 PM, Monday through Saturday.",
    },
    {
      icon: <CreditCard size={22} />,
      title: "Payment Policy",
      content:
        "We accept various payment methods including credit cards, bank transfers, and digital wallets.",
    },
    {
      icon: <UserCheck size={22} />,
      title: "Privacy Policy",
      content:
        "Your personal information is protected and will never be shared with third parties.",
    },
    {
      icon: <HelpCircle size={22} />,
      title: "Support Policy",
      content:
        "24/7 customer support available through our hotline and online chat.",
    },
  ];

  return (
    <Container>
      <Hero>
        <Title level={1}>Our Policies</Title>
        <Paragraph>
          We are committed to providing the best service possible while ensuring
          transparency and fairness in all our dealings.
        </Paragraph>
      </Hero>

      <ContentWrapper>
        <PolicyGrid>
          {policies.map((policy, index) => (
            <PolicyCard
              key={index}
              title={
                <>
                  <IconWrapper>{policy.icon}</IconWrapper>
                  {policy.title}
                </>
              }
            >
              <Paragraph
                style={{ color: "#64748b", margin: 0, lineHeight: 1.6 }}
              >
                {policy.content}
              </Paragraph>
            </PolicyCard>
          ))}
        </PolicyGrid>

        <StyledDivider />

        <AdditionalInfo>
          <Title level={3}>Additional Information</Title>
          <Paragraph>
            For more detailed information about our policies or if you have any
            questions, please don't hesitate to contact our customer service
            team. We're here to help ensure you have the best possible
            experience with our services.
          </Paragraph>
        </AdditionalInfo>
      </ContentWrapper>
    </Container>
  );
};

export default PolicyPage;
