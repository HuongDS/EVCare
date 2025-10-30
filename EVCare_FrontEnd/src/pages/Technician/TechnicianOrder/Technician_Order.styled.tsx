import styled from "styled-components";

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
  font-family: "Outfit", sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 95vh;
  padding: 24px;
  background-color: ${COLORS.grayLight};

  @media (max-width: ${BREAKPOINTS.tablet}) {
    padding: 16px;
  }
`;

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
`;

export const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${COLORS.primary};
  text-align: center;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    font-size: 1.6rem;
  }
`;

export const SearchWrapper = styled.div`
  width: 100%;
  max-width: 300px;
  display: flex;
  justify-content: center;
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
  margin-top: auto;
  padding-top: 24px;
`;

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
