import React from "react";
import { Link } from "react-router";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 12px 0;
  margin: 0 40px 20px 40px;

  border-bottom: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    justify-content: flex-start;
    gap: 0.75rem;
    overflow-x: auto;
    white-space: nowrap;
    padding: 16px;
    margin: 0 0 16px 0;

    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

interface CategoryProps {
  $active: boolean;
}

export const Category = styled(Link)<CategoryProps>`
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-family: "Outfit", sans-serif;
  font-size: 16px;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 30px;
  border: 1px solid transparent;

  color: #4a5568;
  background-color: #f1f5f9;
  border-color: #e2e8f0;

  ${({ $active }) =>
    $active &&
    `
    color: white;
    font-weight: 700;
    background: linear-gradient(135deg, #00c656 0%, #00ad4e 100%);
    box-shadow: 0 4px 12px rgba(0, 173, 78, 0.3);
    transform: translateY(-2px);
    border-color: transparent;
  `}

  &:hover:not(${({ $active }) => $active && "true"}) {
    color: #00ad4e;
    background-color: #e6f7ee;
    border-color: #a0eec7;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    display: inline-block;
    font-size: 15px;
    padding: 8px 20px;
  }
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
          to={`/appointmentHistory`}
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
