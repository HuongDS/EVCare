import styled from "styled-components";

/* 🎨 Màu sắc & responsive breakpoints */
const COLORS = {
  primary: "#00ad4e",
  primaryDark: "#008c3a",
  grayDark: "#222",
  grayMedium: "#555",
  grayLight: "#f5f5f5",
};

const BREAKPOINTS = {
  tablet: "768px",
  mobile: "480px",
};

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  min-height: 100vh;
  background-color: ${COLORS.grayLight};
  font-family: "Outfit", sans-serif;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    padding: 16px;
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${COLORS.grayDark};

  @media (max-width: ${BREAKPOINTS.mobile}) {
    font-size: 1.6rem;
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 16px;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 28px;
`;

/* 🌟 Base Button */
const BaseButton = styled.button`
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const BackButton = styled(BaseButton)`
  background-color: ${COLORS.grayMedium};
  color: #fff;

  &:hover {
    background-color: ${COLORS.grayDark};
    transform: translateY(-1px);
  }
`;

export const CartButton = styled(BaseButton)`
  background-color: ${COLORS.primary};
  color: #fff;

  &:hover {
    background-color: ${COLORS.primaryDark};
    transform: translateY(-1px);
  }
`;
