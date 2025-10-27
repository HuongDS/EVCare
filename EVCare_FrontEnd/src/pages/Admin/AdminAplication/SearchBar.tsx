import React from "react";
import { SearchIcon, SearchInput, SearchWrapper } from "./Admin_Application.styled";
import { SearchOutlined } from "@ant-design/icons";

interface Props {
  placeholder: string;
  onSearch: (value: string) => void;
  search: string;
}

export const SearchBar: React.FC<Props> = ({ placeholder, onSearch, search }) => {
  return (
    <SearchWrapper>
      <SearchIcon>
        <SearchOutlined />
      </SearchIcon>
      <SearchInput type="text" placeholder={placeholder} value={search} onChange={(e) => onSearch(e.target.value)} />
    </SearchWrapper>
  );
};
