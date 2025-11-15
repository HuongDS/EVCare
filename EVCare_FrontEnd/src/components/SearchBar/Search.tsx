import { debounce } from "@mui/material";
import styled from "styled-components";

interface handleSearchProps {
  handleSearchValue: (v: string) => void;
  placeholder?: string;
  searchValue?: string;
}

const SearchBar = ({
  handleSearchValue,
  placeholder,
  searchValue,
}: handleSearchProps) => {
  const handleChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleSearchValue(event.target.value);
    },
    400
  );
  return (
    <StyledWrapper>
      <div className="group">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="search-icon">
          <g>
            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
          </g>
        </svg>
        <input
          id="query"
          className="input"
          type="search"
          placeholder={placeholder}
          name="searchbar"
          value={searchValue}
          onChange={handleChange}
        />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .group {
    display: flex;
    line-height: 28px;
    align-items: center;
    position: relative;
    max-width: 300px;
  }

  .input {
    font-family: "Outfit", sans-serif;
    width: 100%;
    height: 44px;
    padding-left: 2.75rem;
    border: 1px solid #00ad4e;
    border-radius: 12px;
    color: #686868;

    outline: none;
    transition: all 0.25s cubic-bezier(0.19, 1, 0.22, 1);
    cursor: text;
    z-index: 0;
  }

  .input::placeholder {
    color: #00ad4e;
  }

  .input:hover {
    background: white;
    border-color: #00ad4e;
  }

  .input:active {
    transform: scale(0.98);
  }

  .input:focus {
    border-color: #00ad4e;
    box-shadow: 0 0 15px rgba(0, 173, 78, 0.4);
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    fill: #00ad4e;
    width: 1.15rem;
    height: 1.15rem;
    pointer-events: none;
    z-index: 1;
  }
`;

export default SearchBar;
