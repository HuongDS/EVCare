import styled from "styled-components";
import { Button } from "react-bootstrap";
import { lighten } from "polished";
import { motion } from "framer-motion";

const EVCareGreen = "#00ad4e";
const TEXT_COLOR_DARK = "#2A3D45";
const ACCENT_CREAM = "#F5F0E6";

export const AboutUsWrapper = styled.section`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: transparent;
  font-family: "Outfit", sans-serif;
  color: ${TEXT_COLOR_DARK};
  padding: 5rem 0;
  gap: 5rem;
`;

export const AboutUsButton = styled(Button)`
  background: linear-gradient(135deg, #00c656 0%, ${EVCareGreen} 100%);
  color: #fff;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 50px;
  font-family: "Outfit", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.25);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: linear-gradient(
      135deg,
      ${lighten(0.05, EVCareGreen)} 0%,
      ${EVCareGreen} 100%
    );
    box-shadow: 0 6px 20px rgba(0, 173, 78, 0.4);
    transform: translateY(-2px);
  }
`;

export const AboutUsContentBox = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 1100px;
  padding: 0 5%;
`;

export const AboutTitle = styled.h2`
  font-size: clamp(2.8rem, 7vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 1rem;
  letter-spacing: -0.05em;
  color: ${EVCareGreen};
`;

export const StatsBox = styled(motion.div)`
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  width: 100%; /* SỬA TỪ 150% THÀNH 100% */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

export const DetailsNumberWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 2rem;
  width: 100%;
`;

export const DetailsItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  min-width: 180px;
`;

export const CircleAccent = styled(motion.div)`
  width: 40px;
  height: 40px;
  background-color: ${ACCENT_CREAM};
  border-radius: 50%;
  position: absolute;
  z-index: -1;
  top: -10px;
  right: -10px;
  opacity: 0.8;
  filter: blur(5px);
`;

export const NumberContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
`;

export const DetailsNumber = styled.p`
  font-size: clamp(3rem, 6vw, 4.5rem);
  font-weight: 1000;
  margin: 0;
  line-height: 1;
`;

export const DetailsDescription = styled.p`
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  font-weight: 500;
  opacity: 0.8;
  line-height: 1.4;
  margin: 0;
`;
