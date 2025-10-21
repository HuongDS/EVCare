import styled from "styled-components";

export const FooterWrapper = styled.footer`
  background: linear-gradient(to top, #ebffe7, #f9fff8);
  color: #2d3748;
  padding: 20px 40px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 40px;
  font-family: "Outfit", sans-serif;
  border-top: 4px solid #00ad4e;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 40px 30px;
  }
`;

export const Brand = styled.div`
  img {
    width: 200px;
    height: auto;
    margin-bottom: 20px;
  }

  p {
    font-size: 0.95rem;
    color: #555e68;
    line-height: 1.6;
    max-width: 350px;
    margin: 0;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    img {
      width: 170px;
    }
  }
`;

export const Links = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  h4 {
    margin-bottom: 10px;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a202c;
    position: relative;
    padding-bottom: 10px;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 40px;
      height: 3px;
      background: #00ad4e;
      border-radius: 2px;
    }
  }

  a {
    text-decoration: none;
    color: #333;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.25s ease;

    &:hover {
      color: #00ad4e;
      padding-left: 8px;
      text-shadow: none;
    }
  }

  @media (max-width: 768px) {
    align-items: center;
    h4::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

export const Contact = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  h4 {
    margin-bottom: 10px;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a202c;
    position: relative;
    padding-bottom: 10px;
    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 40px;
      height: 3px;
      background: #00ad4e;
      border-radius: 2px;
    }
  }

  .item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1rem;
    color: #333;
    cursor: default;
    transition: color 0.25s ease;

    i {
      color: #00ad4e;
      font-size: 1.4rem;
      width: 25px;
      text-align: center;
      transition: transform 0.25s ease;
    }

    &:hover {
      color: #00ad4e;
      i {
        transform: scale(1.1);
      }
    }
  }

  @media (max-width: 768px) {
    align-items: center;
    h4::after {
      left: 50%;
      transform: translateX(-50%);
    }
    .item {
      width: 220px;
      align-items: flex-start;
    }
  }
`;

export const SubFooter = styled.div`
  background-color: #f9fff8;
  border-top: 1px solid #d6e8d4;
  padding: 20px;
  text-align: center;
  font-family: "Outfit", sans-serif;
  font-size: 0.9rem;
  color: #64748b;
`;
