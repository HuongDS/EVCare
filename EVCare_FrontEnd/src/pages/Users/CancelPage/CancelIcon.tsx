import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";

const MAIN_RED = "#FF4D4F";

const pop = keyframes`
  50% { transform: scale(1.1); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255,77,79,0.4); }
  50% { box-shadow: 0 0 40px rgba(255,77,79,0.6); }
`;

const Circle = styled.span<{ visible: boolean }>`
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 5px solid #ffb4b4;
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s ease;

  ${({ visible }) =>
    visible &&
    css`
      border-color: ${MAIN_RED};
      background: ${MAIN_RED};
      animation: ${pop} 0.5s ease, ${glow} 1.6s ease-in-out infinite;
    `}
`;

const Svg = styled.svg`
  width: 70px;
  height: 70px;
  stroke: white;
  stroke-width: 5;
  fill: none;
  stroke-linecap: round;
`;

const Line = styled.path<{ animate: boolean }>`
  stroke-dasharray: 48;
  stroke-dashoffset: ${({ animate }) => (animate ? 0 : 48)};
  transition: stroke-dashoffset 0.6s ease;
`;

const CancelIcon: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [draw, setDraw] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => setDraw(true), 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <Circle visible={visible}>
      <Svg viewBox="0 0 52 52">
        <Line animate={draw} d="M16 16 L36 36" />
        <Line animate={draw} d="M36 16 L16 36" />
      </Svg>
    </Circle>
  );
};

export default CancelIcon;
