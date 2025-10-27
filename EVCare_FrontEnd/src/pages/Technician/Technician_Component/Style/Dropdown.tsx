import React, { useState } from "react";
import styled from "styled-components";

// ===== Styled Components =====
const DropdownContainer = styled.div`
  border: 1px solid #c1c2c5;
  border-radius: 6px;
  background-color: white;
  position: relative;
  width: 120px;
  font-size: 13px;
`;

const Trigger = styled.button<{ $open?: boolean }>`
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  font-weight: 500;
  background: white;
  border: none;
  cursor: pointer;
  color: #333;
  border-radius: 6px;
  transition: all 0.3s ease;
  outline: none;

  &::after {
    content: "▾";
    font-size: 14px;
    transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
    transition: transform 0.3s ease;
  }

  &:hover {
    background-color: #f6f6f6;
  }
`;

const List = styled.ul<{ $open?: boolean }>`
  list-style: none;
  padding: 0;
  margin: 4px 0 0 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  position: absolute;
  width: 100%;
  z-index: 100;
  max-height: ${({ $open }) => ($open ? "200px" : "0")};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  overflow: hidden auto;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const ListItem = styled.li`
  padding: 8px 10px;
  cursor: pointer;
  font-size: 13px;
  color: #333;
  background: white;

  &:hover {
    background-color: #f0f0f0;
  }
`;

// ===== Props =====
interface DropdownProps {
  id?: string | number;
  triggerLabel: string;
  items: { label: string; onClick: () => void }[];
}

// ===== Component =====
const Dropdown: React.FC<DropdownProps> = ({ triggerLabel, items }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <DropdownContainer>
      <Trigger $open={open} onClick={() => setOpen((prev) => !prev)}>
        {triggerLabel}
      </Trigger>

      <List $open={open}>
        {items.map((item, idx) => (
          <ListItem key={idx} onClick={() => handleSelect(item.onClick)}>
            {item.label}
          </ListItem>
        ))}
      </List>
    </DropdownContainer>
  );
};

export default Dropdown;
