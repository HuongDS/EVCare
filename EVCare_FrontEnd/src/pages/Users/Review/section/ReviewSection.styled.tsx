import styled from "styled-components";

const COLORS = {
  primary: "#16a34a",
  grayDark: "#222",
  grayMedium: "#666",
  grayLight: "#f5f5f5",
  border: "#eee",
};

const BREAKPOINTS = {
  tablet: "768px",
  mobile: "480px",
};

export const ReviewContainer = styled.div`
  font-family: "Outfit", sans-serif;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    gap: 16px;
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    gap: 12px;
    padding: 8px;
  }
`;

export const ReviewCard = styled.div`
  font-family: "Outfit", sans-serif;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  border-left: 5px solid ${COLORS.primary};
  box-shadow: 0 2px 8px rgba(22, 163, 74, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25);
  }
`;

export const HeadSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

export const HeadLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const HeadRight = styled.div`
  color: ${COLORS.grayMedium};
  font-size: 14px;
`;

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${COLORS.primary};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
`;

export const CustomerName = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${COLORS.grayDark};
`;

export const CreateAt = styled.div`
  font-size: 13px;
  color: ${COLORS.grayMedium};
`;

export const Divider = styled.hr`
  margin: 10px 0 15px;
  border: none;
  height: 1px;
  background-color: ${COLORS.border};
`;

export const BodySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ServiceList = styled.div`
  font-size: 14px;
  color: ${COLORS.primary};
  font-weight: 500;
`;

export const ExpRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ExpLabel = styled.div`
  font-weight: 600;
  color: ${COLORS.grayDark};
  font-size: 15px;
`;

export const CustomerReview = styled.div`
  font-size: 15px;
  line-height: 1.5;
  color: ${COLORS.grayMedium};
`;
