import React from "react";
// 1. Import style mới
import { SearchContainer, SearchInput, SearchIcon } from "./Admin_Customer_Vehicle.styled";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, onSearchChange }) => (
  // 2. Dùng component style mới
  <SearchContainer>
    <SearchIcon>
      <FaSearch />
    </SearchIcon>
    <SearchInput
      type="text"
      placeholder="Search by name, email, or phone number..."
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  </SearchContainer>
);

export default SearchBar;
