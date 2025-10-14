import { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

type SortOrder = "newest" | "oldest" | "none";

interface SortDateButtonProps {
  onSort: (order: SortOrder) => void;
}

export const SortDateButton = ({ onSort }: SortDateButtonProps) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");

  const buttonStyle: React.CSSProperties = {
    background: "linear-gradient(to right, #6366f1, #191b7f)",
    color: "white",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: "600",
    padding: "4px 8px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: "all 0.3s ease",
  };

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

    if (sortOrder === "none") {
      newOrder = "newest";
    } else if (sortOrder === "newest") {
      newOrder = "oldest";
    } else {
      newOrder = "none";
    }

    setSortOrder(newOrder);
    onSort(newOrder);
  };

  const getIcon = () => {
    switch (sortOrder) {
      case "newest":
        return <ArrowDown size={20} />;
      case "oldest":
        return <ArrowUp size={20} />;
      default:
        return <ArrowUpDown size={20} />;
    }
  };

  const getText = () => {
    switch (sortOrder) {
      case "newest":
        return "Newest";
      case "oldest":
        return "Oldest";
      default:
        return "Default";
    }
  };

  return (
    <button
      onClick={handleClick}
      style={dynamicStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {getIcon()}
      {getText()}
    </button>
  );
};
