import logo from "../../assets/EVCare.png";

import { useState } from "react";
import { Link } from "react-router";
import Authentication from "../../pages/Shared/Auth/Authentication";
import { Navbar, Logo, SearchBar, Menu, Buttons } from "./Header.styled";
import { useSelector } from "react-redux";
import type { RootState } from "../../states/store";
import { logout } from "../../services/authService";

export default function Header() {
  const [showAuth, setShowAuth] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
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

      <Authentication show={showAuth} handleClose={() => setShowAuth(false)} />
    </Navbar>
  );
}
