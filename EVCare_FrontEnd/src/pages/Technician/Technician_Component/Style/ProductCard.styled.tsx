import styled from "styled-components";

const COLORS = {
  primary: "#00ad4e",
  text: "#222",
  textSecondary: "#555",
  background: "#ffffff",
  border: "#e6e6e6",
  shadowDefault: "rgba(0, 0, 0, 0.08)",
  shadowHover: "rgba(0, 173, 78, 0.25)",
};

const TRANSITION = {
  duration: "0.35s",
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
};

export const CardContainer = styled.div`
  width: 100%;
  max-width: 280px;
  background: ${COLORS.background};
  border-radius: 14px;
  border: 1px solid ${COLORS.border};
  box-shadow: 0 6px 16px ${COLORS.shadowDefault};
  overflow: hidden;
  transition: transform ${TRANSITION.duration} ${TRANSITION.easing},
    box-shadow ${TRANSITION.duration} ${TRANSITION.easing};

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 14px 30px ${COLORS.shadowHover};
  }

  @media (max-width: 480px) {
    max-width: 92%;
    margin: 0 auto;
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform ${TRANSITION.duration} ${TRANSITION.easing};

  ${CardContainer}:hover & {
    transform: scale(1.05);
  }

  @media (max-width: 480px) {
    height: 160px;
  }
`;

export const Info = styled.div`
  padding: 16px 18px 20px;
  text-align: center;
  color: ${COLORS.textSecondary};
`;

export const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${COLORS.text};
  margin-bottom: 8px;
  transition: color ${TRANSITION.duration} ease;

  ${CardContainer}:hover & {
    color: ${COLORS.primary};
  }
`;

export const Description = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  color: ${COLORS.textSecondary};
`;
