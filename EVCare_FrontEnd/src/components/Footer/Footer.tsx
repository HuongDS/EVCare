import { Link } from "react-router";
import logo from "../../assets/EVCare.png";
import {
  FooterWrapper,
  Brand,
  Links,
  Contact,
  SubFooter,
} from "./Footer.styled";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <FooterWrapper>
        <Brand>
          <img src={logo} alt="EVCare logo" />
          <p>
            Specializing in providing EV maintenance and care services with
            leading technology.
          </p>
        </Brand>

        <Links>
          <h4>Company</h4>
          <Link to="/">Home</Link>
          <Link to="/service">Service</Link>
          <Link to="/about">About us</Link>
          <Link to="/policy">Policies</Link>
        </Links>

        <Contact>
          <h4>Contact Info</h4>
          <div className="item">
            <i className="bi bi-facebook"></i>
            <span>EVcare VietNam</span>
          </div>
          <div className="item">
            <i className="bi bi-envelope"></i>
            <span>evcare@gmail.com</span>
          </div>
          <div className="item">
            <i className="bi bi-telephone"></i>
            <span>(+84) 0123.456.789</span>
          </div>
        </Contact>
      </FooterWrapper>

      <SubFooter>© {currentYear} EVCare. All rights reserved.</SubFooter>
    </>
  );
}
