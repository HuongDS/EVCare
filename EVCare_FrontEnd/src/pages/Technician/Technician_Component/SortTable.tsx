import React, { useState } from "react";
import styled from "styled-components";
import { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";

interface SortTableProps {
  sortName: TechnicianWorkingSessionEnum[];
  active: TechnicianWorkingSessionEnum;
  onChange: (val: TechnicianWorkingSessionEnum) => void;
}

const Nav = styled.div`
  width: 100%;
  position: relative;
`;

const Menu = styled.nav<{ open?: boolean }>`
  display: flex;
  justify-content: space-between;
  font-size: 1rem;

  span {
    flex: 1;
    text-align: center;
    position: relative;
    font-weight: bold;
    color: #2f2f2f;
    cursor: pointer;
    padding: 0.5rem 0;
    white-space: nowrap;

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

  @media (max-width: 768px) {
    flex-direction: column;
    display: ${(props) => (props.open ? "flex" : "none")};
    span {
      text-align: left;
      padding: 0.5rem 1rem;
      border-bottom: 1px solid #ddd;
    }
  }
`;

const DropdownButton = styled.button`
  display: none;
  background: #00ad4e;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  font-weight: bold;
  width: 100%;
  cursor: pointer;
  border-radius: 4px;

  @media (max-width: 768px) {
    display: block;
  }
`;

const SortTable: React.FC<SortTableProps> = ({
  sortName,
  active,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Nav>
      <DropdownButton onClick={() => setOpen((prev) => !prev)}>
        {active} ▼
      </DropdownButton>
      <Menu open={open}>
        {sortName.map((name) => (
          <span
            key={name}
            className={active === name ? "active" : ""}
            onClick={() => {
              onChange(name);
              setOpen(false); // đóng dropdown khi chọn
            }}
          >
            {name}
          </span>
        ))}
      </Menu>
    </Nav>
  );
};

export default SortTable;
