import React from "react";
import { Link } from "react-router";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  border-bottom: 1px solid #ccc;
  justify-content: center;
  gap: 10%;
`;

interface CategoryProps {
  $active: boolean;
}

const Category = styled(Link)<CategoryProps>`
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};
  text-decoration: none;
  color: ${({ $active }) => ($active ? "#4caf50" : "black")};
  font-family: "Outfit", sans-serif;
  font-size: ${({ $active }) => ($active ? "18px" : "")};
  margin: 10px 10px;
`;

interface MyComponentProps {
  sortName: string[];
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

const OrderHistorySort: React.FC<MyComponentProps> = ({ sortName, onSelectCategory, selectedCategory }) => {
  const selectCategory = (category: string) => {
    onSelectCategory(category);
  };

  return (
    <Container>
      {sortName.map((name) => (
        <Category
          to={`/orderHistory`}
          key={name}
          $active={selectedCategory === name}
          onClick={() => selectCategory(name)}
        >
          {name}
        </Category>
      ))}
    </Container>
  );
};

export default OrderHistorySort;
