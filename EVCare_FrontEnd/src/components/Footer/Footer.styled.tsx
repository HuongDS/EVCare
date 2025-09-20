import styled from "styled-components";
export const FooterWrapper = styled.footer`
  background: linear-gradient(to top, #ebffe7, #f9fff8);
  padding: 40px 60px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 40px;
  font-family: "Outfit", sans-serif;
`;

export const Brand = styled.div`
  width: 20%;
  height: 100px;
  display: flex;
  align-items: center;
  gap: 12px;
  img {
    width: 100%;
    object-fit: contain;
    transform: scale(2);
  }
  span {
    font-size: 1.6rem;
    font-weight: 700;
    color: #00994d;
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
`;
