import styled from "styled-components";
import { motion } from "framer-motion";

export const Container = styled.div`
  background: linear-gradient(to bottom, #f9fff8 0%, #ffffff 100%);
  min-height: 100vh;
  * {
    font-family: "Outfit", sans-serif;
  }
`;

export const Hero = styled(motion.div)`
  background: linear-gradient(135deg, #022c14 0%, #005a27 50%, #008a3e 100%);
  padding: 5rem 2rem 6rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;

    background: radial-gradient(circle at 20% 30%, rgba(0, 173, 78, 0.15) 0%, transparent 50%,
      radial-gradient(circle at 80% 70%, rgba(0, 200, 80, 0.15) 0%, transparent 50% );

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

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
`;

export const HeroTitle = styled.h1`
  color: #ffffff;
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const HeroSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.25rem;
  max-width: 650px;
  margin: 0 auto 2rem;
  line-height: 1.7;
`;

export const TrustBadge = styled(motion.div)`
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
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: -3rem auto 0;
  padding: 0 2rem 4rem;
  position: relative;
  z-index: 2;
`;

export const MainContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 3.5rem;
  align-items: flex-start;
  margin-bottom: 20px;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const TableOfContents = styled.aside`
  position: sticky;
  top: 130px;
  padding-left: 1.5rem;
  border-left: 3px solid #e2e8f0;
  margin-top: 60px;
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #334155;
    margin-bottom: 1.5rem;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  li a {
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    color: #64748b;
    transition: all 0.25s ease;

    display: block;
    padding: 6px 12px;
    border-radius: 8px;

    &:hover {
      color: #00ad4e;
      background-color: #e6f7ee;
    }

    &.active {
      color: #008a3e;
      font-weight: 700;
      background-color: #e6f7ee;
      transform: scale(1.02);
    }
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const DocumentPaper = styled(motion.div)`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #eef2f7;
  overflow: hidden;
`;

export const PolicySection = styled(motion.section)`
  padding: 2.5rem 3rem;
  border-bottom: 1px solid #f1f5f9;
  scroll-margin-top: 200px;
  &:last-child {
    border-bottom: none;
  }
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #008a3e;
  margin-bottom: 1.5rem;
`;

export const SectionContent = styled.div`
  .ant-typography {
    color: #475569;
    line-height: 1.8;
    font-size: 1.05rem;
    margin-bottom: 1.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const IconWrapper = styled.div`
  background: linear-gradient(135deg, #e6f7ee 0%, #d1f3e0 100%);
  padding: 0.75rem;
  border-radius: 12px;
  display: inline-flex;
  color: #00ad4e;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 173, 78, 0.15);
`;

export const AdditionalInfo = styled(motion.div)`
  max-width: 900px;
  margin: 4rem auto 0;
  padding: 3rem;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background: radial-gradient(circle at 10% 20%, rgba(0, 173, 78, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 90% 80%, rgba(0, 173, 78, 0.03) 0%, transparent 50%);

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

  .ant-typography {
    color: #475569;
    line-height: 1.8;
    margin: 0px auto;
    font-size: 1.05rem;
    position: relative;
  }

  &.ant-typography-h3 {
    color: #1e293b;
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &:not(.ant-typography-h3) {
    color: #475569;
    line-height: 1.8;
    margin: 0px auto;
    font-size: 1.05rem;
  }
`;

export const ContactButton = styled(motion.button)`
  margin-top: 1.5rem;
  background: linear-gradient(135deg, #00c656 0%, #00ad4e 100%);
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
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.25);

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 173, 78, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const DecorativeShape = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;

  background: radial-gradient(circle, rgba(0, 173, 78, 0.05) 0%, transparent 70%);

  top: -150px;
  right: -150px;
  pointer-events: none;
`;
