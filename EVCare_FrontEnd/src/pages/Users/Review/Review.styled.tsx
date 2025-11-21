import styled from "styled-components";

const PRIMARY = "#16a34a";
const BG_LIGHT = "#f7faf9";
const BORDER = "#e3e8e5";

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
  flex: 0 0 250px;
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

export const SortWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
`;

export const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: ${PRIMARY};
  color: white;
  border: none;
  border-radius: 50px;
  padding: 8px 14px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  font-size: 1em;

  &:hover {
    background: #15803d;
    transform: translateY(-2px);
  }
`;

export const LoadingText = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #555;
`;

export const EndText = styled.p`
  text-align: center;
  margin: 1rem;
  color: #777;
`;

export const ActiveFilterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f0fdf4;
  color: ${PRIMARY};
  border: 1px solid ${BORDER};
  border-radius: 10px;
  padding: 8px 14px;
  margin-bottom: 16px;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;

  span:first-child {
    color: #333;
    font-weight: 600;
  }

  &:hover {
    background: #dcfce7;
    transform: translateY(-1px);
  }
`;
