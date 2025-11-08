import React from "react";
import styled, { keyframes } from "styled-components";
import CarIcon from "./Icons/CarIcon";

const roadStripesAnimation = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -60px 0; /* Di chuyển các vạch đường */
  }
`;

const carShake = keyframes`
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  25% {
    transform: translateX(-50%) translateY(-2px);
  }
  75% {
    transform: translateX(-50%) translateY(2px);
  }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  font-family: "Outfit", sans-serif;
  min-width: 280px;
`;

const CarAnimationContainer = styled.div`
  position: relative;
  width: 100px;
  height: 60px;
  margin-bottom: 20px;
  overflow: hidden;
`;

const AnimatedCar = styled.div`
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  animation: ${carShake} 0.5s infinite alternate;
  z-index: 2;
`;

const Road = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 10px;
  background-color: #333;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    background-image: linear-gradient(
      to right,
      #fff 0%,
      #fff 50%,
      transparent 50%,
      transparent 100%
    );
    background-size: 60px 2px;
    animation: ${roadStripesAnimation} 1s linear infinite;
    transform: translateY(-50%);
  }
`;

const LoadingText = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  color: #00ad4e;
  margin-top: 0;
  margin-bottom: 5px;
`;

const SubText = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
`;

const SpinnerComponent: React.FC = () => {
  return (
    <SpinnerWrapper>
      <CarAnimationContainer>
        <AnimatedCar>
          <CarIcon />
        </AnimatedCar>
        <Road />
      </CarAnimationContainer>
      <LoadingText>Please wait a moment...</LoadingText>
      <SubText>Processing your request.</SubText>
    </SpinnerWrapper>
  );
};

export default SpinnerComponent;
