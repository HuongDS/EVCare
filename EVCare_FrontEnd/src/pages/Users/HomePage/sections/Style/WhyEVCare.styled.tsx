import styled from "styled-components";
import { motion } from "framer-motion";

export const Container = styled.div`
  font-family: "Outfit", sans-serif;
  padding: 80px 5%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

export const Title = styled.h2`
  font-size: clamp(2.8rem, 7vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 2rem;
  letter-spacing: -0.05em;
  color: #00ad4e;
  text-align: center;
`;

export const CardList = styled(motion.ul)`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  list-style: none;
  gap: 30px;
  padding: 0;
  width: 100%;
  max-width: 1200px;
`;

export const CardItem = styled(motion.li)`
  flex: 1;
  min-width: 300px;
  max-width: 360px;
  height: 400px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
  position: relative;
  overflow: hidden;
  background: #ffffff;
  color: #333;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px;
  text-align: left;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.1;
    transition: opacity 0.3s ease-in-out;
  }

  &:hover::before {
    opacity: 0.15;
  }

  &:nth-child(1)::before {
    background: linear-gradient(45deg, #e6f7ee 0%, #00ad4e 100%);
  }
  &:nth-child(2)::before {
    background: linear-gradient(45deg, #d1e8e2 0%, #00ad4e 100%);
  }
  &:nth-child(3)::before {
    background: linear-gradient(45deg, #f5f0e6 0%, #00ad4e 100%);
  }

  @media (max-width: 480px) {
    min-width: 100%;
    height: auto;
    padding: 30px;
    gap: 2rem;
    justify-content: flex-start;
  }
`;

export const CardIcon = styled.div`
  font-size: 3rem;
  color: #00ad4e;
  margin-bottom: auto;
  line-height: 1;
`;

export const CardCategory = styled.p`
  font-size: 0.9rem;
  font-weight: 600;
  color: #5b6b73;
  text-transform: uppercase;
  margin: 0 0 10px 0;
  letter-spacing: 1px;
`;

export const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.4;
  color: #2a3d45;
`;