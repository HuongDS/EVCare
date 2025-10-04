import React from "react";
import styled from "styled-components";

interface SortTableProps {
  sortName: (string | number)[];
  active: number | "To Do List";
  onChange: (val: number | "To Do List") => void;
}

const Nav = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Menu = styled.nav`
  width: 100%;
  display: flex;
  justify-content: start;
  column-gap: 1.5rem;
  padding-left: 2%;
  font-size: 1rem;

  span {
    position: relative;
    text-decoration: none;
    font-weight: bold;
    color: #2f2f2f;
    cursor: pointer;
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

  span:hover {
    color: black;
  }

  .active {
    color: black;
  }

  @media (min-width: 750px) and (max-width: 900px) {
    font-size: 16px;
  }

  @media (max-width: 750px) {
    font-size: 14px;
    column-gap: 1rem;
  }
`;

const SortTable: React.FC<SortTableProps> = ({
  sortName,
  active,
  onChange,
}) => {
  return (
    <Nav>
      <Menu>
        {sortName.map((name) => (
          <span
            key={name}
            className={active === name ? "active" : ""}
            onClick={() => onChange(name as number | "To Do List")}
          >
            {name}
          </span>
        ))}
      </Menu>
    </Nav>
  );
};

export default SortTable;
