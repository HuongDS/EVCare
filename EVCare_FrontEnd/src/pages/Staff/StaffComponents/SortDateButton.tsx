import { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import styled from "styled-components";

type SortOrder = "asc" | "desc";

interface SortDateButtonProps {
  onSort: (order: SortOrder) => void;
  disabled: boolean;
}

export const SortDateButton = ({ onSort, disabled }: SortDateButtonProps) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const buttonStyle: React.CSSProperties = {};

  const [isHovered, setIsHovered] = useState(false);

  const dynamicStyle: React.CSSProperties = {
    ...buttonStyle,
    transform: isHovered ? "translateY(-2px)" : "translateY(0)",
    boxShadow: isHovered
      ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  };

  const handleClick = () => {
    let newOrder: SortOrder;

    if (sortOrder === "desc") {
      newOrder = "asc";
    } else {
      newOrder = "desc";
    }

    setSortOrder(newOrder);
    onSort(newOrder);
  };

  const getIcon = () => {
    switch (sortOrder) {
      case "desc":
        return <ArrowDown size={20} />;
      case "asc":
        return <ArrowUp size={20} />;
      default:
        return <ArrowUpDown size={20} />;
    }
  };

  const getText = () => {
    switch (sortOrder) {
      case "desc":
        return "Newest";
      case "asc":
        return "Oldest";
      default:
        return "Newest";
    }
  };

  return (
    <ButtonStyled
      onClick={handleClick}
      style={dynamicStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
    >
      {getIcon()}
      {getText()}
    </ButtonStyled>
  );
};

const ButtonStyled = styled.button`
  background: linear-gradient(to right, #00ad4e, #67f68b);
  color: white;
  font-family: "Outfit", sans-serif;
  font-weight: 600;
  padding: 2px 4px;
  margin-right: 2%;
  height: 35px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:disabled {
    background: #ccc;
    color: #686868;
  }
`;
