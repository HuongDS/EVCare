import { useState } from "react";
import { Nav, DropdownButton, Menu } from "./Style/SortTable.styled";

interface SortTableProps {
  sortName: string[];
  active: string;
  onChange: (val: string) => void;
}

const SortTable = ({ sortName, active, onChange }: SortTableProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Nav>
      <DropdownButton onClick={() => setOpen((prev) => !prev)}>
        {String(active)} ▼
      </DropdownButton>
      <Menu open={open}>
        {sortName.map((name) => (
          <span
            key={String(name)}
            className={active === name.replace(/\s+/g, "") ? "active" : ""}
            onClick={() => {
              onChange(name.replace(/\s+/g, ""));
              setOpen(false);
            }}
          >
            {String(name)}
          </span>
        ))}
      </Menu>
    </Nav>
  );
};

export default SortTable;
