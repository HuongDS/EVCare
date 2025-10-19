import React from "react";
import styled from "styled-components";
import { Typography, Card } from "antd";
import {
  Shield,
  FileCheck,
  Clock,
  CreditCard,
  UserCheck,
  HelpCircle,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const { Title, Paragraph } = Typography;

const PolicyPage: React.FC = () => {
  const policies = [
    {
      icon: <Shield size={24} />,
      title: "Service Quality Guarantee",
      content:
        "We guarantee the quality of our services. If you're not satisfied, we'll make it right with no questions asked.",
    },
    {
      icon: <FileCheck size={24} />,
      title: "Flexible Booking Policy",
      content:
        "Appointments can be rescheduled up to 24 hours before the scheduled time without any penalty or additional fees.",
    },
    {
      icon: <Clock size={24} />,
      title: "Service Hours",
      content:
        "Our service hours are from 8:00 AM to 6:00 PM, Monday through Saturday. Extended hours available upon request.",
    },
    {
      icon: <CreditCard size={24} />,
      title: "Payment Policy",
      content:
        "We accept various payment methods including VNPay, PayOS and Cash for your convenience.",
    },
    {
      icon: <UserCheck size={24} />,
      title: "Privacy Protection",
      content:
        "Your personal information is protected with bank-level encryption and will never be shared with third parties.",
    },
    {
      icon: <HelpCircle size={24} />,
      title: "24/7 Support",
      content:
        "Round-the-clock customer support available through our hotline, online chat, and email support channels.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const navigate = useNavigate();

  return (
    <Container>
      <Hero
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <HeroContent>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <HeroTitle>Our Policies & Commitments</HeroTitle>
            <HeroSubtitle>
              We are committed to providing the best service possible while
              ensuring transparency and fairness in all our dealings.
            </HeroSubtitle>
            <TrustBadge
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Sparkles size={18} />
              Trusted by 10,000+ customers
            </TrustBadge>
          </motion.div>
        </HeroContent>
      </Hero>

      <ContentWrapper>
        <PolicyGrid
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {policies.map((policy, index) => (
            <PolicyCard
              key={index}
              variants={itemVariants}
              title={
                <>
                  <IconWrapper>{policy.icon}</IconWrapper>
                  {policy.title}
                </>
              }
            >
              <Paragraph
                style={{
                  color: "#64748b",
                  margin: 0,
                  lineHeight: 1.7,
                  fontSize: "1rem",
                }}
              >
                {policy.content}
              </Paragraph>
            </PolicyCard>
          ))}
        </PolicyGrid>

        <AdditionalInfo
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <DecorativeShape />
          <Title level={3}>
            <HelpCircle size={28} color="#3b82f6" />
            Need More Information?
          </Title>
          <Paragraph>
            For more detailed information about our policies or if you have any
            questions, please don't hesitate to contact our customer service
            team. We're here to help ensure you have the best possible
            experience with our services.
          </Paragraph>
          <ContactButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/contact")}
          >
            Contact Support
            <ChevronRight size={18} />
          </ContactButton>
        </AdditionalInfo>
      </ContentWrapper>
    </Container>
  );
};

export default PolicyPage;

const Container = styled.div`
  background: linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%);
  min-height: 100vh;
  * {
    font-family: "Outfit", sans-serif;
  }
`;

const Hero = styled(motion.div)`
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  padding: 5rem 2rem 6rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
        circle at 20% 30%,
        rgba(59, 130, 246, 0.15) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 70%,
        rgba(168, 85, 247, 0.15) 0%,
        transparent 50%
      );
    animation: pulse 8s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: url('data:image/svg+xml,<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>');
    opacity: 0.4;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  color: #ffffff;
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.25rem;
  max-width: 650px;
  margin: 0 auto 2rem;
  line-height: 1.7;
`;

const TrustBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 0.95rem;
  font-weight: 500;

  svg {
    color: #fbbf24;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: -3rem auto 0;
  padding: 0 2rem 4rem;
  position: relative;
  z-index: 2;
`;

const PolicyGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const PolicyCard = styled(motion(Card))`
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: #ffffff;
  height: 100%;
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #4cfa6e);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    box-shadow: 0 12px 40px rgba(59, 130, 246, 0.15);
    transform: translateY(-8px);

    &::before {
      opacity: 1;
    }
  }

  .ant-card-head {
    border-bottom: 1px solid #f1f5f9;
    padding: 1.75rem 2rem 1.25rem;
    background: linear-gradient(to bottom, #fafbfc 0%, #ffffff 100%);
  }

  .ant-card-head-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
  }

  .ant-card-body {
    padding: 1.75rem 2rem;
  }
`;

const IconWrapper = styled.div`
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  padding: 0.75rem;
  border-radius: 12px;
  display: inline-flex;
  color: #3b82f6;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
`;

const AdditionalInfo = styled(motion.div)`
  max-width: 900px;
  margin: 4rem auto 0;
  padding: 3rem;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-radius: 20px;
  border: 2px solid #e2e8f0;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
        circle at 10% 20%,
        rgba(59, 130, 246, 0.03) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 90% 80%,
        rgba(168, 85, 247, 0.03) 0%,
        transparent 50%
      );
    pointer-events: none;
  }

  h3 {
    color: #1e293b;
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    position: relative;
  }

  p {
    color: #475569;
    line-height: 1.8;
    margin: 0;
    font-size: 1.05rem;
    position: relative;
  }
`;

const ContactButton = styled(motion.button)`
  margin-top: 1.5rem;
  background: linear-gradient(135deg, #3bf683 0%, #1fbc34 100%);
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

  &:hover {
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const DecorativeShape = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.1) 0%,
    transparent 70%
  );
  top: -150px;
  right: -150px;
  pointer-events: none;
`;
