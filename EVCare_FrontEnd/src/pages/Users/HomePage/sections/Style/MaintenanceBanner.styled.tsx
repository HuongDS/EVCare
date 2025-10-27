import styled from "styled-components";
import { motion } from "framer-motion";

const TEXT_COLOR_LIGHT = "#EAEAEA";
const PRIMARY_GREEN = "#00ad4e";
const DARK_BG_START = "#1C2B33";
const DARK_BG_END = "#121C21";

export const BannerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  font-family: "Outfit", sans-serif;
  color: ${TEXT_COLOR_LIGHT};
  background: linear-gradient(135deg, ${DARK_BG_START}, ${DARK_BG_END});
`;

export const BottomBrandsWrapper = styled.div`
  position: absolute;
  bottom: 3rem;
  left: 0;
  width: 100%;
  z-index: 4;
`;

export const GridPattern = styled(motion.div)`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.05) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.5;
`;

export const ContentContainer = styled(motion.div)`
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
`;

export const BannerTitle = styled(motion.h2)`
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  max-width: 800px;
  letter-spacing: -0.02em;
  line-height: 1.2;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

export const HighlightText = styled.span`
  color: ${PRIMARY_GREEN};
`;
