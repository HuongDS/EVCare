import React, { useState } from "react";
import { Link } from "react-router";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  border-bottom: 1px solid #ccc;
`;

const Category = styled(Link)<{ active: boolean }>`
  padding: 10px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  text-decoration: ${({ active }) => (active ? "underline" : "none")};
  color: ${({ active }) => (active ? "#4caf50" : "black")};

  &:hover {
    background-color: #f0f0f0;
  }
`;

interface MyComponentProps {
  sortName: string[];
}

const SortTable: React.FC<MyComponentProps> = ({ sortName }) => {
  const [activeCategory, setActiveCategory] = useState<string>(sortName[0]);

  const selectCategory = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <Container>
      {sortName.map((name) => (
        <Category
          to={`/staff/appointments`}
          key={name}
          active={activeCategory === name}
          onClick={() => selectCategory(name)}
        >
          {name}
        </Category>
      ))}
    </Container>
  );
};

export default SortTable;
