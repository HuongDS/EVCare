import React from "react";
import styled from "styled-components";
import { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";

interface SortTableProps {
  sortName: TechnicianWorkingSessionEnum[];
  active: TechnicianWorkingSessionEnum;
  onChange: (val: TechnicianWorkingSessionEnum) => void;
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
    font-weight: bold;
    color: #2f2f2f;
    cursor: pointer;
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

  .active {
    color: black;

    &::after {
      width: 100%;
      transform: translateX(-50%) scaleX(1);
    }
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
            onClick={() => onChange(name)}
          >
            {name}
          </span>
        ))}
      </Menu>
    </Nav>
  );
};

export default SortTable;
