// Footer.tsx
import styled from "styled-components";
import logo from "../../assets/EVCare.png";

const FooterWrapper = styled.footer`
  background: linear-gradient(to top, #ebffe7, #f9fff8);
  padding: 40px 60px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 40px;
  font-family: "Outfit", sans-serif;
`;

const Brand = styled.div`
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

const Links = styled.div`
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

const Contact = styled.div`
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

export default function Footer() {
  return (
    <FooterWrapper>
      <Brand>
        <img src={logo} alt="EVCare logo" />
      </Brand>

      <Links>
        <h4>Links</h4>
        <a href="#">Home</a>
        <a href="#">Service</a>
        <a href="#">About us</a>
      </Links>

      <Contact>
        <h4>Contact</h4>
        <div className="item">
          <i className="bi bi-facebook"></i>
          EVcare VietNam
        </div>
        <div className="item">
          <i className="bi bi-envelope"></i>
          evcare@gmail.com
        </div>
        <div className="item">
          <i className="bi bi-telephone"></i>
          (+84) 0123.456.789
        </div>
      </Contact>
    </FooterWrapper>
  );
}
