import styled from "styled-components";

export const HeaderContainer = styled.div`
  font-family: "Outfit", sans-serif;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 56px;
  background: #f5fffa;
  border-bottom: 1px solid #eef3ef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 3%;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

export const LogoContainer = styled.img`
  display: flex;
  align-items: center;
  max-width: 12%;
  height: auto;

  @media (max-width: 768px) {
    max-width: 20%;
  }
`;

export const DateContainer = styled.div`
  font-size: 1.3em;
  display: flex;
  align-items: center;
  gap: 8px;
  span {
    font-weight: 1000;
  }

  @media (max-width: 768px) {
    font-size: 1.1em;
  }
`;
