import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import styled from "styled-components";
import { SortDateButton } from "./SortDateButton";
import SortDateRange from "./SortDateRange";

const SortWrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Container = styled.div`
  display: flex;
  gap: 5px;
  padding: 5px;
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
  margin: 15px;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #4caf50;
    border-radius: 10px;
  }
`;

interface CategoryProps {
  $active: boolean;
}

const Category = styled(Link)<CategoryProps>`
  padding: 2px 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: ${({ $active }) => ($active ? "600" : "500")};
  text-decoration: none;
  color: ${({ $active }) => ($active ? "#ffffff" : "#555555")};
  font-family: "Outfit", sans-serif;
  font-size: 14px;
  border-radius: 8px;
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg, #4caf50 0%, #45a049 100%)"
      : "transparent"};
  position: relative;
  white-space: nowrap;
  box-shadow: ${({ $active }) =>
    $active ? "0 4px 12px rgba(76, 175, 80, 0.3)" : "none"};
  transform: ${({ $active }) =>
    $active ? "translateY(-2px)" : "translateY(0)"};

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 8px;
    padding: 2px;
    background: ${({ $active }) =>
      $active ? "transparent" : "linear-gradient(135deg, #e0e0e0, #f5f5f5)"};
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: ${({ $active }) => ($active ? "0" : "1")};
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: ${({ $active }) =>
      $active
        ? "linear-gradient(135deg, #45a049 0%, #3d8b40 100%)"
        : "rgba(76, 175, 80, 0.08)"};
    color: ${({ $active }) => ($active ? "#ffffff" : "#4caf50")};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

interface MyComponentProps {
  sortName: string[];
  setSortBy: (v: string) => void;
  setSortOrder: (v: string) => void;
  setBeginDate: (v: string) => void;
  setEndDate: (v: string) => void;
  disabled: boolean;
}

const SortTable: React.FC<MyComponentProps> = ({
  sortName,
  setSortBy,
  setSortOrder,
  setBeginDate,
  setEndDate,
  disabled,
}) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sortParam = params.get("sortBy") || sortName[0];
  const [activeCategory, setActiveCategory] = useState<string>(sortParam);

  const selectCategory = (category: string) => {
    setActiveCategory(category);
    setSortBy(category.trim().replace(/\s+/g, ""));
  };

  return (
    <SortWrapperStyled>
      <Container>
        {sortName.map((name) => (
          <Category
            to={`/staff/appointments?sortBy=${encodeURIComponent(
              name.split(/\s+/).join("")
            )}`}
            key={name}
            $active={activeCategory === name}
            onClick={() => selectCategory(name)}
          >
            {name}
          </Category>
        ))}
      </Container>
      <SortDateRange setBeginDate={setBeginDate} setEndDate={setEndDate} />
      <SortDateButton onSort={setSortOrder} disabled={disabled} />
    </SortWrapperStyled>
  );
};

export default SortTable;
