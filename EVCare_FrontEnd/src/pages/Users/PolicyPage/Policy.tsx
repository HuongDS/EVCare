import React, { useState, useEffect } from "react"; // (NEW) Thêm useState, useEffect
import {
  Container,
  Hero,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  TrustBadge,
  ContentWrapper,
  MainContentWrapper,
  TableOfContents,
  DocumentPaper,
  PolicySection,
  SectionTitle,
  SectionContent,
  IconWrapper,
  AdditionalInfo,
  ContactButton,
  DecorativeShape,
} from "./Policy.styled";

import { Typography } from "antd";
import { Shield, FileCheck, Clock, CreditCard, UserCheck, HelpCircle, Sparkles, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

// (NEW) Sửa lại import cho đúng chuẩn
const { Title, Paragraph } = Typography;

const policies = [
  {
    id: "quality-guarantee",
    icon: <Shield size={24} />,
    title: "Service Quality Guarantee",
    content: [
      "EVCare is committed to providing the highest quality of service. We stand behind our work and guarantee your satisfaction.",
      "If you are not 100% satisfied with the quality of our service, please contact us within 48 hours. We will re-perform the service at no additional cost or offer a full refund.",
      "This guarantee applies to all maintenance and repair services performed by our certified technicians.",
    ],
  },
  {
    id: "booking-policy",
    icon: <FileCheck size={24} />,
    title: "Flexible Booking Policy",
    content: [
      "We understand that plans can change. Appointments can be rescheduled or canceled up to 24 hours before the scheduled time without any penalty.",
      "Cancellations made within 24 hours of the appointment may be subject to a small cancellation fee. Please refer to our booking confirmation email for full details.",
    ],
  },
  {
    id: "service-hours",
    icon: <Clock size={24} />,
    title: "Service Hours",
    content: [
      "Our standard service hours are from 8:00 AM to 6:00 PM, Monday through Saturday. We are closed on Sundays and public holidays.",
      "Extended hours and emergency services are available upon request for an additional fee. Please contact our support team to arrange out-of-hours service.",
    ],
  },
  {
    id: "payment-policy",
    icon: <CreditCard size={24} />,
    title: "Payment Policy",
    content: [
      "We accept various payment methods for your convenience, including VNPay, PayOS, major credit cards (Visa, MasterCard), and Cash.",
      "Full payment is required upon completion of the service. For extensive repairs, a deposit may be required before work begins.",
    ],
  },
  {
    id: "privacy-protection",
    icon: <UserCheck size={24} />,
    title: "Privacy Protection",
    content: [
      "Your privacy is our top priority. All personal information provided to EVCare is protected with bank-level SSL encryption.",
      "We will never sell, rent, or share your personal information, vehicle data, or service history with any third parties without your explicit consent, except as required by law.",
    ],
  },
  {
    id: "support-policy",
    icon: <HelpCircle size={24} />,
    title: "24/7 Support",
    content: [
      "While our service centers have fixed hours, our customer support team is available 24/7. You can reach us through our hotline, online chat, and email support channels for any inquiries or emergencies.",
    ],
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

const Policy: React.FC = () => {
  const navigate = useNavigate();
  // --- (NEW) State để lưu ID của mục đang active ---
  const [activeId, setActiveId] = useState(policies[0].id);

  // --- (NEW) Logic "Scroll Spy" ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      // rootMargin: "-30% 0px -65% 0px"
      // Nghĩa là: chỉ "active" khi mục đó nằm trong khoảng 30% top và 65% bottom
      { rootMargin: "-30% 0px -65% 0px" }
    );

    // Bắt đầu "quan sát" tất cả các mục
    policies.forEach((policy) => {
      const element = document.getElementById(policy.id);
      if (element) {
        observer.observe(element);
      }
    });

    // Dọn dẹp khi component unmount
    return () => {
      policies.forEach((policy) => {
        const element = document.getElementById(policy.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []); // Chỉ chạy 1 lần

  return (
    <Container>
      <Hero initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <HeroContent>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <HeroTitle>Our Policies & Commitments</HeroTitle>
            <HeroSubtitle>
              We are committed to providing the best service possible while ensuring transparency and fairness in all
              our dealings.
            </HeroSubtitle>
            <TrustBadge
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Sparkles size={18} color="#00c656" />
              Trusted by 10,000+ customers
            </TrustBadge>
          </motion.div>
        </HeroContent>
      </Hero>

      <ContentWrapper>
        <MainContentWrapper>
          <TableOfContents>
            <h4>On this page</h4>
            <ul>
              {policies.map((policy) => (
                <li key={policy.id}>
                  {/* --- (NEW) Thêm class "active" nếu ID trùng --- */}
                  <a href={`#${policy.id}`} className={activeId === policy.id ? "active" : ""}>
                    {policy.title}
                  </a>
                </li>
              ))}
            </ul>
          </TableOfContents>

          <DocumentPaper
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {policies.map((policy) => (
              <PolicySection key={policy.id} id={policy.id} variants={itemVariants}>
                <SectionTitle>
                  <IconWrapper>{policy.icon}</IconWrapper>
                  {policy.title}
                </SectionTitle>
                <SectionContent>
                  {policy.content.map((paragraph, pIndex) => (
                    <Paragraph key={pIndex}>{paragraph}</Paragraph>
                  ))}
                </SectionContent>
              </PolicySection>
            ))}
          </DocumentPaper>
        </MainContentWrapper>

        <AdditionalInfo
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <DecorativeShape />
          {/* (NEW) Sửa lại Title cho đúng (Antd) */}
          <Title level={3} className="ant-typography-h3">
            <HelpCircle size={28} color="#00ad4e" />
            Need More Information?
          </Title>
          <Paragraph>
            For more detailed information about our policies or if you have any questions, please don't hesitate to
            contact our customer service team. We're here to help ensure you have the best possible experience with our
            services.
          </Paragraph>
          <ContactButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate("/contact")}>
            Contact Support
            <ChevronRight size={18} />
          </ContactButton>
        </AdditionalInfo>
      </ContentWrapper>
    </Container>
  );
};

export default Policy;
