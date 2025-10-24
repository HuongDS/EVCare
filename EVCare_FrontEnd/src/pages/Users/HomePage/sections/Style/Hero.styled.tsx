import styled from "styled-components";
import { motion } from "framer-motion";

const PRIMARY_GREEN = "#00ad4e";
const DARK_GREEN = "#009c46";
const TEXT_COLOR_DARK = "#2A3D45";

export const HeroWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  font-family: "Inter", sans-serif;
  color: ${TEXT_COLOR_DARK};
  padding: 2rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const HeroContentGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    "text image"
    "button button";
  align-items: center;
  justify-items: center;
  gap: 2rem 4rem;
  width: 90%;
  max-width: 1200px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      "image"
      "text"
      "button";
    gap: 1.5rem;
    text-align: center;
    width: 100%;
  }
`;

export const TextColumn = styled(motion.div)`
  grid-area: text;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;

  @media (max-width: 992px) {
    align-items: center;
  }
`;

export const ImageWrapper = styled(motion.div)`
  grid-area: image;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 992px) {
    min-height: 30vh;
    max-height: 40vh;
  }
`;

export const StyledImage = styled(motion.img)`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0px 20px 15px rgba(0, 0, 0, 0.2));
`;

export const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.8rem, 7vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 1rem;
  letter-spacing: -0.05em;
`;

export const HeroSubtitle = styled(motion.div)`
  font-size: clamp(1.1rem, 2.2vw, 1.5rem);
  margin-bottom: 2rem;
`;

export const HeroButton = styled(motion.a)`
  grid-area: button;
  justify-self: center;
  margin-top: 1rem;

  display: inline-block;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 30px;
  border: none;
  background-color: ${PRIMARY_GREEN};
  color: white;
  text-decoration: none;
  box-shadow: 0 5px 15px rgba(0, 173, 78, 0.4);
  cursor: pointer;

  &:hover {
    transform: translateY(-3px) scale(1.02);
    background-color: ${DARK_GREEN};
    transition: all 0.3s ease;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.8rem 1.6rem;
  }
`;
