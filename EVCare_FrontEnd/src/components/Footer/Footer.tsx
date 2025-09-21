import logo from "../../assets/EVCare.png";
import { FooterWrapper, Brand, Links, Contact } from "./Footer.styled";

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
