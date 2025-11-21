import styled from "styled-components";

export const StyledWrapper = styled.div`
  .group {
    display: flex;
    align-items: center;
    position: relative;
    max-width: 300px;
  }

  .input {
    font-family: "Outfit", sans-serif;
    width: 100%;
    height: 40px;
    padding-left: 2.5rem;
    border: none;
    border-radius: 12px;
    background-color: white;
    color: black;
    outline: none;
    cursor: text;
    box-shadow: 0 0 0 1.5px #4caf50, 0 0 25px -17px #4caf50;
    transition: transform 0.25s cubic-bezier(0.19, 1, 0.22, 1), box-shadow 0.25s cubic-bezier(0.19, 1, 0.22, 1),
      color 0.25s ease;

    z-index: 0;
  }

  .input::placeholder {
    color: #bdbecb;
    transition: color 0.25s ease;
  }

  .input:hover {
    box-shadow: 0 0 0 2px #4caf50, 0 0 25px -15px #4caf50;
  }

  .input:focus {
    box-shadow: 0 0 0 2.5px #4caf50, 0 0 30px -10px #4caf50;
    transform: scale(1.02);
  }

  .input:active {
    transform: scale(0.97);
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    fill: #bdbecb;
    width: 1rem;
    height: 1rem;
    pointer-events: none;
    transition: fill 0.25s ease, transform 0.25s ease;
    z-index: 1;
  }

  .input:hover + .search-icon,
  .input:focus + .search-icon {
    fill: #4caf50;
    transform: scale(1.1);
  }
`;
