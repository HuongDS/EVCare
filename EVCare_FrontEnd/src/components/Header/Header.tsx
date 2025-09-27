import logo from "../../assets/EVCare.png";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Authentication from "../../pages/Shared/Auth/Authentication";
import { Navbar, Logo, Menu, Buttons, SearchBar } from "./Header.styled";
import { useSelector } from "react-redux";
import type { RootState } from "../../states/store";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { AiOutlineMenu } from "react-icons/ai";

export default function Header() {
  const [showAuth, setShowAuth] = useState(false);
  const [tongle, setTongle] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const [isMobile, setIsMobile] = useState(window.innerWidth < 750);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 750);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      setTongle(true);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setShowAuth(false);
    }
  }, [isAuthenticated]);

  return (
    <Navbar>
      <Logo>
        <Link to="/">
          <img src={logo} alt="EVCare logo" />
        </Link>
      </Logo>

      <SearchBar>
        <input type="text" placeholder="Search service..." />
        <button>
          <i className="bi bi-search"></i>
        </button>
      </SearchBar>

      <Menu>
        <Link to="/" className="active">
          Home
        </Link>
        <Link to="/service">Service</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </Menu>
      {isAuthenticated ? (
        <Buttons>
          <button className="btn btn-fill">Log Out</button>
        </Buttons>
      ) : (
        <Buttons>
          <button className="btn btn-fill" onClick={() => setShowAuth(true)}>
            Get Started
          </button>
        </Buttons>
      )}

      {isMobile ? (
        <Buttons>
          {tongle && (
            <DropdownButton id="dropdown-item-button" title={<AiOutlineMenu />}>
              <Dropdown.Item as="button" onClick={() => navigate("/service")}>
                Service
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => navigate("/about")}>
                About Us
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => navigate("/contact")}>
                Contact
              </Dropdown.Item>
            </DropdownButton>
          )}
        </Buttons>
      ) : undefined}

      <Authentication show={showAuth} handleClose={() => setShowAuth(false)} />
    </Navbar>
  );
}
