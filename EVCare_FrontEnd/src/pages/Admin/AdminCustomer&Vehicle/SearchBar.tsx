import React from "react";

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, onSearchChange }) => (
  <div className="search-bar">
    <input
      type="text"
      className="search-input"
      placeholder="Search by name, email, or phone number..."
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
    />
    {/* <button className="filter-btn">Filter</button> */}
  </div>
);

export default SearchBar;
