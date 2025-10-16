import styled from "styled-components";

const PRIMARY = "#16a34a";
const BG_LIGHT = "#f7faf9";
const BORDER = "#e3e8e5";
const TEXT_MAIN = "#1f2937";

export const Container = styled.div`
  font-family: "Outfit", sans-serif;
  display: flex;
  gap: 28px;
  padding: 32px;
  min-height: 90vh;
  background: ${BG_LIGHT};
  transition: all 0.3s ease;

  @media (max-width: 992px) {
    flex-direction: column;
    padding: 20px;
  }
`;

export const Sidebar = styled.aside`
  font-family: "Outfit", sans-serif;
  flex: 0 0 260px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  padding: 20px;
  height: fit-content;
  position: sticky;
  top: 24px;
  align-self: flex-start;
  border: 1px solid ${BORDER};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(22, 163, 74, 0.1);
  }

  @media (max-width: 992px) {
    width: 100%;
    position: static;
    order: 1;
  }
`;

export const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid ${BORDER};
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  padding: 28px 24px;
  transition: all 0.3s ease;
  animation: fadeIn 0.4s ease;

  &:hover {
    box-shadow: 0 10px 28px rgba(22, 163, 74, 0.1);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 992px) {
    order: 2;
    padding: 20px;
  }
`;

export const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  color: ${TEXT_MAIN};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 24px;
    background: ${PRIMARY};
    border-radius: 4px;
  }
`;

export const SearchWrapper = styled.div`
  margin-bottom: 24px;
  position: relative;
  align-self: center;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  animation: fadeInCards 0.4s ease;

  @keyframes fadeInCards {
    from {
      opacity: 0;
      transform: scale(0.97);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
