import styled from "styled-components";
export const Navbar = styled.header`
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Outfit", sans-serif;
  background: linear-gradient(to bottom, #ebffe7, #f9fff8);
`;

export const Logo = styled.div`
  width: 15%;
  display: flex;
  align-items: center;
  img {
    width: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
`;

export const SearchBar = styled.div`
  flex: 1;
  max-width: 400px;
  position: relative;
  height: 40%;

  input {
    width: 99%;
    height: 100%;
    padding: 0 50px 0 12px;
    border: 1px solid #ccc;
    border-radius: 20px;
    outline: none;
    font-size: 16px;
    font-family: "Outfit", sans-serif;
  }

  button {
    position: absolute;
    top: 51%;
    right: 1.9%;
    transform: translateY(-50%);
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50%;
    background: #f2f1f1;
    color: black;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.2s;
  }

  button:hover {
    background: #1877f2;
    color: white;
  }

  @media (max-width: 768px) {
    input {
      width: 60%;
    }
    button {
      right: 43%;
    }
  }
`;

export const Menu = styled.nav`
  width: 35%;
  display: flex;
  justify-content: flex-end;
  gap: 5%;
  font-size: 1.3rem;
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

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 20%;
  margin-right: 5%;

  .btn {
    width: max-content;
    height: 35px;
    border-radius: 15px;
    border: 0.5px solid #ccc;
    font-family: "Outfit", sans-serif;
    font-size: 16px;
    font-weight: bold;
  }

  .btn-fill {
    background-color: #00ad4e;
    color: white;
  }

  .btn-fill:hover {
    background-color: #1877f2;
  }
`;
