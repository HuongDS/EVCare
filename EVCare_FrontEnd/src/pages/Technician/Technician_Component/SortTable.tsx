import { useState } from "react";
import { Nav, DropdownButton, Menu } from "./Style/SortTable.styled";

interface SortTableProps<T> {
  sortName: T[];
  active: T;
  onChange: (val: T) => void;
}

const SortTable = <T,>({ sortName, active, onChange }: SortTableProps<T>) => {
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
            className={active === name ? "active" : ""}
            onClick={() => {
              onChange(name);
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
