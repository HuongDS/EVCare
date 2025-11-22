import React from "react";
import { SearchContainer, SearchInput, SearchIcon } from "./Admin_Customer_Vehicle.styled";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeHolder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, onSearchChange, placeHolder }) => (
  <SearchContainer>
    <SearchIcon>
      <FaSearch />
    </SearchIcon>
    <SearchInput
      type="text"
      placeholder={placeHolder}
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  </SearchContainer>
);

export default SearchBar;
