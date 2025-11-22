import { Button } from "react-bootstrap";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import { lighten } from "polished";
import background from "../../../assets/background02.jpg";

const EVCareGreen = "#00ad4e";
const LightGreenBg = "#f9fff8";

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${LightGreenBg};
  padding-bottom: 5rem;
  font-family: "Outfit", sans-serif;
  overflow-x: hidden;
`;

export const HeaderSection = styled.div`
  text-align: center;
  padding: 4rem 1rem 3rem;
  margin-bottom: 2rem;
`;

export const ServiceLabel = styled.p`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
`;

export const MainTitle = styled.h1`
  font-size: 5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #00ad4e, #6bffb0);
  -webkit-background-clip: text;
  background-clip: text;
  color: rgba(235, 255, 231, 0.85);
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

export const BookButton = styled(Button as any)`
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
    background: linear-gradient(135deg, ${lighten(0.05, EVCareGreen)} 0%, ${EVCareGreen} 100%);
    box-shadow: 0 6px 20px rgba(0, 173, 78, 0.4);
    transform: translateY(-2px);
  }
`;

export const SortSection = styled.div`
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

export const SortLabel = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  margin-right: 0.75rem;
  align-self: center;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  font-size: 20px;
`;

export const SortButton = styled(Button as any)`
  margin: 0 0.25rem;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;

  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);

  ${(props) =>
    props.active
      ? `
    background: linear-gradient(
      135deg, 
      rgba(0, 198, 86, 0.5) 0%,
      rgba(0, 173, 78, 0.6) 100% 
    );
    border: 1px solid ${EVCareGreen}; 
    color: white;
    box-shadow: 0 4px 15px rgba(0, 173, 78, 0.3);
  `
      : `
    background: rgba(0, 0, 0, 0.2); 
    border: 1px solid rgba(255, 255, 255, 0.1); 
    color: rgba(255, 255, 255, 0.8); 
    
    &:hover {
      background: rgba(0, 0, 0, 0.3);
      border-color: rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }
  `}
`;

export const ServicesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5rem;
  margin-bottom: 4rem;
`;

export const ServiceStorySection = styled(motion.section)<{
  $imagePosition: "left" | "right";
}>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  grid-template-areas: ${(props) => (props.$imagePosition === "left" ? "'image text'" : "'text image'")};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "image"
      "text";
    gap: 2rem;
  }
`;

export const ServiceImageContainer = styled.div`
  grid-area: image;
  img {
    width: 100%;
    height: auto;
    max-height: 400px;
    object-fit: cover;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
`;

export const ServiceTextContainer = styled.div`
  grid-area: text;
  font-family: "Outfit", sans-serif;
`;

export const ServiceTitle = styled.h2`
  font-weight: 700;
  color: #212529;
  font-size: 2.2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid ${EVCareGreen};
  display: inline-block;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const ServiceDescription = styled.p`
  color: #282b2d;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  line-height: 1.7;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
`;

export const ServiceDuration = styled.p`
  color: #334155;
  font-size: 1.2rem;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  margin-bottom: 1.5rem;
  strong {
    font-weight: 700;
  }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const StickyBookButton = styled(motion.button)<{ $isLoading?: boolean }>`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 999;
  background: linear-gradient(135deg, #00c656 0%, ${EVCareGreen} 100%);
  color: #fff;
  border: none;
  padding: 1rem 1.8rem;
  border-radius: 50px;
  font-family: "Outfit", sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(0, 173, 78, 0.4);
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  justify-content: center;
  min-height: 58px;
  min-width: 180px;

  &::before {
    content: "";
    position: absolute;
    inset: -3px;
    border-radius: 50px;
    background: linear-gradient(135deg, ${lighten(0.1, EVCareGreen)}, ${EVCareGreen});
    filter: blur(8px);
    opacity: 0.7;
    z-index: -1;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  .button-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(255, 255, 255, 0.5);
    border-top-color: #fff;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
  }

  ${({ $isLoading }) =>
    $isLoading &&
    `
    cursor: not-allowed;
    animation: none; 
    &::before {
      opacity: 0.5; 
    }
  `}

  animation: ${bounce} 1.5s ease-in-out infinite;
  animation-delay: 1s;
`;

export const ServiceListContainer = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px 20px;

  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background-image: url(${background});
    background-size: cover;
    background-position: center;
    filter: blur(10px);
    transform: scale(1.02);
  }
`;
