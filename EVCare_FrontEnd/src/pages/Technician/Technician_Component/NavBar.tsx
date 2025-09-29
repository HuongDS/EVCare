import { Link, useNavigate } from "react-router";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import styled from "styled-components";

const Menu = styled.nav`
  width: 100%;
  display: flex;
  column-gap: 1.5rem;
  font-size: 1.2rem;
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

  @media (min-width: 750px) and (max-width: 900px) {
    font-size: 16px;
  }
  @media (max-width: 750px) {
    display: none;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;

  .btn {
    width: max-content;
    height: fit-content;
    border-radius: 15px;
    border: 0.5px solid #ccc;
    font-family: "Outfit", sans-serif;
    font-size: 14px;
    font-weight: bold;
  }

  .btn-fill {
    background-color: #00ad4e;
    color: white;
  }

  .btn-fill:hover {
    background-color: #1877f2;
  }
  @media (max-width: 750px) {
    .btn {
      font-size: 12px;
    }
  }
`;

const Nav = styled.div`
  height: 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default function Navbar() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 750);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 750);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Nav>
      {/* Menu desktop */}
      {!isMobile && (
        <Menu>
          <Link to="to-do" className="active">
            To Do List
          </Link>
          <Link to="in-progress">In Progress</Link>
          <Link to="done">Done Today</Link>
          <Link to="paused">Paused</Link>
        </Menu>
      )}

      {/* Menu mobile */}
      {isMobile && (
        <Buttons>
          <DropdownButton id="dropdown-item-button" title={<AiOutlineMenu />}>
            <Dropdown.Item as="button" onClick={() => navigate("to-do")}>
              To Do List
            </Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => navigate("in-progress")}>
              In Progress
            </Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => navigate("done")}>
              Done Today
            </Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => navigate("paused")}>
              Paused
            </Dropdown.Item>
          </DropdownButton>
        </Buttons>
      )}
    </Nav>
  );
}
