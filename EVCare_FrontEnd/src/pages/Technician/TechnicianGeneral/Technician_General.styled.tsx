import styled from "styled-components";

const COLORS = {
  primary: "#4caf50",
  grayDark: "#222",
  grayMedium: "#666",
  grayLight: "#f5f5f5",
  error: "#e53935",
};

const BREAKPOINTS = {
  tablet: "768px",
  mobile: "480px",
};

export const AppointmentWrapper = styled.div`
  padding: 24px;
  background: ${COLORS.grayLight};
  min-height: 100vh;
  font-family: "Outfit", sans-serif;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    padding: 16px;
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`;

export const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: ${COLORS.primary};
  text-align: center;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    font-size: 1.8rem;
  }
`;

export const AppointmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
  transition: opacity 0.3s ease-in-out;

  &.fade-out {
    opacity: 0.4;
  }
`;

export const Watermark = styled.div`
  padding: 80px 0;
  text-align: center;
  color: rgba(0, 0, 0, 0.25);
  font-size: 1.8rem;
  font-weight: 600;
  user-select: none;
`;

export const ErrorMessage = styled.div`
  color: ${COLORS.error};
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  margin-top: 20px;
`;
