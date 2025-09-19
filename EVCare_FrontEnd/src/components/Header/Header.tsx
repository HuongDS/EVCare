import logo from "../../assets/EVCare.png";
import styled from "styled-components";
import { useState } from "react";
import { Link } from "react-router";
import Authentication from "../../pages/Shared/Auth/Authentication";


const Navbar = styled.header`
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Outfit", sans-serif;
  background: linear-gradient(to bottom, #ebffe7, #f9fff8);
  @media (max-width: 768px) {
    flex-wrap: wrap;
    height: auto;
    padding: 1rem;
  }
`;

const Logo = styled.div`
  width: 15%;
  min-width: 200px;
  display: flex;
  align-items: center;
  img {
    height: 60px;
    width: 300%;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const SearchBar = styled.div`
  flex: 1;
  max-width: 400px;
  position: relative;
  height: 50%;

  input {
    width: 99%;
    height: 100%;
    padding: 0 50px 0 12px;
    border: 1px solid #ccc;
    border-radius: 20px;
    outline: none;
    font-size: 16px;
    font-family: "Outfit", sans-serif;
  }

  button {
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50%;
    background: #f2f1f1;
    color: black;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.2s;
  }

  button:hover {
    background: #1877f2;
    color: white;
  }

  @media (max-width: 768px) {
    order: 3;
    width: 100%;
    margin-top: 1rem;
  }
`;

const Menu = styled.nav`
  width: 35%;
  display: flex;
  justify-content: flex-end;
  gap: 5%;
  font-size: clamp(1.3rem, 0.9rem, 0.875rem);
  a {
    position: relative;
    text-decoration: none;
    font-weight: bold;
    color: #2f2f2f;
    transition: color 0.2s;
    padding-bottom: 4px;
    &::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: 0;
      height: 2px;
      width: 0;
      background: #00ad4e;
      transform: translateX(-50%) scaleX(0);
      transform-origin: center;
      transition: transform 0.3s ease;
    }

    &:hover::after {
      width: 100%;
      transform: translateX(-50%) scaleX(1);
    }
  }

  a:hover {
    color: black;
  }

  .active {
    color: black;
  }

  @media (max-width: 768px) {
    order: 2;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 0.5rem;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 20%;
  margin-right: 5%;

  .btn {
    width: 83px;
    height: 35px;
    border-radius: 15px;
    border: 0.5px solid #ccc;
    font-family: "Outfit", sans-serif;
    font-size: 16px;
    font-weight: bold;
  }

  .btn-fill {
    background-color: #00ad4e;
    color: white;
  }

  .btn-fill:hover {
    background-color: #1877f2;
  }
`;

export default function Header() {
  const [showAuth, setShowAuth] = useState(false);
  return (
    <Navbar className="navbar">
      <Logo>
        <img src={logo} alt="EVCare logo" />
      </Logo>

      <SearchBar>
        <input type="text" placeholder="Search service..." />
        <button>
          <i className="bi bi-search"></i>
        </button>
      </SearchBar>

      <Menu>
        <a href="#" className="active">
          Home
        </a>
        <a href="#">Service</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </Menu>

      <Buttons>
        <button className="btn btn-fill" onClick={() => setShowAuth(true)}>
          Sign Up
        </button>
      </Buttons>

      <Authentication show={showAuth} handleClose={() => setShowAuth(false)} />
    </Navbar>
  );
}
