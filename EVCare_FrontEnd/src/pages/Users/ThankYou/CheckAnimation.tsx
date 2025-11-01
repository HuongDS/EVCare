import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";

const MAIN_GREEN = "#00AD4E";

const pop = keyframes`
  50% {
    transform: scale(1.15);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.5s ease;
`;

const Circle = styled.span<{ checked: boolean }>`
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 5px solid #cfd1d7;
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  ${({ checked }) =>
    checked &&
    css`
      border-color: ${MAIN_GREEN};
      background: ${MAIN_GREEN};
      animation: ${pop} 0.6s ease;
      box-shadow: 0 0 25px rgba(0, 173, 78, 0.4);
    `}
`;

const CheckSvg = styled.svg<{ checked: boolean }>`
  width: 60px;
  height: 45px;
  position: relative;
  top: 3px;
  fill: none;
  stroke: white;
  stroke-width: 7;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 80px;
  stroke-dashoffset: ${({ checked }) => (checked ? 0 : 80)};
  transition: stroke-dashoffset 0.4s ease 0.1s;
`;

const Pulse = styled.span<{ checked: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${MAIN_GREEN};
  border-radius: 50%;
  transform: ${({ checked }) => (checked ? "scale(2.2)" : "scale(0)")};
  opacity: ${({ checked }) => (checked ? 0 : 1)};
  transition: all 0.6s ease;
  transition-delay: 0.2s;
`;

const CheckAnimation: React.FC = () => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setChecked(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Wrapper>
      <Circle checked={checked}>
        <Pulse checked={checked} />
        <CheckSvg checked={checked} viewBox="0 0 24 18">
          <polyline points="2 9.5 9 16 22 2" />
        </CheckSvg>
      </Circle>
    </Wrapper>
  );
};

export default CheckAnimation;
