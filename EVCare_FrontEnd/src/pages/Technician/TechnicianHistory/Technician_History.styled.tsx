import styled from "styled-components";

/* 🎨 Màu sắc & responsive breakpoints */
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

/* 📦 Wrapper tổng thể */
export const AppointmentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 24px;
  background: ${COLORS.grayLight};
  font-family: "Outfit", sans-serif;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    padding: 16px;
  }
`;

/* 🏷️ Tiêu đề */
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

export const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: column; /* stack sort + search theo cột */
  align-items: center;
  gap: 12px; /* khoảng cách giữa sort + search */
  margin-bottom: 16px;
`;

export const SortWrapper = styled.div`
  width: 100%;
  max-width: 300px; /* giới hạn độ rộng */
  display: flex;
  justify-content: center;
`;

export const SearchWrapper = styled.div`
  width: 100%;
  max-width: 400px; /* giới hạn độ rộng */
  display: flex;
  justify-content: center;
`;

export const SortSelect = styled.select`
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid ${COLORS.grayMedium};
  background-color: white;
  color: ${COLORS.grayDark};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${COLORS.primary};
  }

  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
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

export const PaginationWrapper = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: center;
  padding: 16px 0;
  background: ${COLORS.grayLight};
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
`;
