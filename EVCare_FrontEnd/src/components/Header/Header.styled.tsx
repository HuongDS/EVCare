import styled from "styled-components";
export const Navbar = styled.header`
  height: 100px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Outfit", sans-serif;
  background: linear-gradient(to bottom, #ebffe7, #f9fff8);
`;

export const Logo = styled.div`
  width: 200px;
  display: flex;
  align-items: center;
  img {
    width: 100%;
    object-fit: cover;
  }
`;

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  padding: 0 3px;
  border-radius: 20px;
  overflow: hidden;
  max-width: 350px;
  width: 100%;

  input {
    flex: 1;
    border: none;
    padding: 8px 12px;
    font-size: 14px;
    min-width: 0;

    &:focus {
      outline: none;
    }
  }

  button {
    flex-shrink: 0;
    background-color: #4caf50;
    border: none;
    color: white;
    padding: 4px 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    i {
      font-size: 16px;
    }

    &:hover {
      background-color: #45a049;
    }
  }

  @media (min-width: 750px) and (max-width: 900px) {
    max-width: 200px;

    input {
      padding: 8px 3px;
      font-size: 12px;
    }

    button {
      i {
        font-size: 14px;
      }
    }
  }
  @media (max-width: 750px) {
    max-width: 200px;

    input {
      padding: 8px 3px;
      font-size: 12px;
    }

    button {
      i {
        font-size: 10px;
      }
    }
  }
`;

export const Menu = styled.nav`
  width: 40%;
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  margin-right: 8%;
  a {
    position: relative;
    text-decoration: none;
    font-weight: bold;
    color: #2f2f2f;
    transition: color 0.2s;
    padding-bottom: 4px;
    &::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: 0;
      height: 2px;
      width: 0;
      background: #00ad4e;
      transform: translateX(-50%) scaleX(0);
      transform-origin: center;
      transition: transform 0.3s ease;
    }

    &:hover::after {
      width: 100%;
      transform: translateX(-50%) scaleX(1);
    }
  }

  a:hover {
    color: black;
  }

  .active {
    color: black;
  }

  @media (min-width: 750px) and (max-width: 900px) {
    width: 80%;
    font-size: 16px;
  }
  @media (max-width: 750px) {
    display: none;
  }
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;

  .btn {
    width: max-content;
    height: fit-content;
    border-radius: 15px;
    border: 0.5px solid #ccc;
    font-family: "Outfit", sans-serif;
    font-size: 14px;
    font-weight: bold;
  }

  .btn-fill {
    background-color: #00ad4e;
    color: white;
  }

  .btn-fill:hover {
    background-color: #1877f2;
  }
  @media (max-width: 750px) {
    .btn {
      font-size: 12px;
    }
  }
`;
