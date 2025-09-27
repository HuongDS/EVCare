import styled from "styled-components";
export const FooterWrapper = styled.footer`
  background: linear-gradient(to top, #ebffe7, #f9fff8);
  padding: 20px 60px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  font-family: "Outfit", sans-serif;
  @media (max-width: 550px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const Brand = styled.div`
  /* width: 20%;
  height: 100px; */
  img {
    width: 200px;
    height: auto;
  }

  @media (max-width: 550px) {
    display: flex;
    justify-content: center;
    img {
      width: 150px;
      height: auto;
    }
  }
`;

export const Links = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  h4 {
    margin-bottom: 6px;
    font-size: 1.2rem;
    font-weight: 600;
  }

  a {
    text-decoration: none;
    color: #2f2f2f;
    font-size: 1rem;
    &:hover {
      text-shadow: 2px 2px #ccc;
    }
  }

  @media (max-width: 550px) {
    align-items: center;
    margin-bottom: 2rem;
  }
`;

export const Contact = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  h4 {
    margin-bottom: 6px;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1rem;
    color: #2f2f2f;

    i {
      color: #00ad4e;
      font-size: 1.2rem;
    }
  }
  @media (max-width: 550px) {
    align-items: center;
  }
`;
