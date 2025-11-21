import styled from "styled-components";
import { motion } from "framer-motion";

interface FocusWordProps {
  $isActive: boolean;
  $manualMode: boolean;
  $blurAmount: number;
  $animationDuration: number;
}

export const FocusContainer = styled.div`
  position: relative;
  display: flex;
  gap: 1em;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

export const FocusWord = styled.span<FocusWordProps>`
  position: relative;
  font-size: 3rem;
  font-weight: 900;
  cursor: ${({ $manualMode }) => ($manualMode ? "pointer" : "default")};
  transition: filter ${({ $animationDuration }) => $animationDuration}s ease;

  filter: blur(
    ${({ $isActive, $blurAmount }) => ($isActive ? 0 : $blurAmount)}px
  );
`;

interface FocusFrameProps {
  $borderColor: string;
  $glowColor: string;
}

export const FocusFrame = styled(motion.div)<FocusFrameProps>`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  box-sizing: content-box;
  border: none;

  .corner {
    position: absolute;
    width: 1rem;
    height: 1rem;
    border: 3px solid ${({ $borderColor }) => $borderColor};
    filter: drop-shadow(0px 0px 4px ${({ $glowColor }) => $glowColor});
    border-radius: 3px;
    transition: none;
  }

  .top-left {
    top: -10px;
    left: -10px;
    border-right: none;
    border-bottom: none;
  }

  .top-right {
    top: -10px;
    right: -10px;
    border-left: none;
    border-bottom: none;
  }

  .bottom-left {
    bottom: -10px;
    left: -10px;
    border-right: none;
    border-top: none;
  }

  .bottom-right {
    bottom: -10px;
    right: -10px;
    border-left: none;
    border-top: none;
  }
`;
