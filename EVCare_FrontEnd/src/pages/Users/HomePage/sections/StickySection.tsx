import React from "react";
import styled from "styled-components";

interface SectionWrapperProps {
  $bgColor?: string;
  $zIndex?: number;
}

const SectionWrapper = styled.section<SectionWrapperProps>`
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.$bgColor || "transparent"};
  z-index: ${(props) => props.$zIndex || 1};
  overflow: hidden;
`;

interface StickySectionProps {
  children: React.ReactNode;
  $bgColor?: string;
  $zIndex?: number;
}

const StickySection: React.FC<StickySectionProps> = ({
  children,
  $bgColor,
  $zIndex,
}) => {
  return (
    <SectionWrapper $bgColor={$bgColor} $zIndex={$zIndex}>
      {children}
    </SectionWrapper>
  );
};

export default StickySection;
