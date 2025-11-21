import styled, { css, keyframes } from "styled-components";

const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Navbar = styled.header<{ $isScrolled: boolean }>`
  transition: all 0.4s ease-in-out;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  height: 85px;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Outfit", sans-serif;
  background: rgba(235, 255, 231, 0.85); /* Nền xanh mờ */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  animation: ${fadeInDown} 0.6s ease-out;

  ${({ $isScrolled }) =>
    $isScrolled &&
    css`
      height: 70px;
      top: 10px;
      width: 90%;
      max-width: 1400px;
      margin: 0 auto;
      border-radius: 50px;
      background: rgba(235, 255, 231, 0.95);
      border: 1px solid rgba(0, 173, 78, 0.2);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    `}

  @media (max-width: 750px) {
    height: 70px;
    padding: 0 15px;
    ${({ $isScrolled }) =>
      $isScrolled &&
      css`
        top: 5px;
        height: 65px;
        width: 90%;
        border-radius: 15px;
      `}
  }
`;

export const Logo = styled.div`
  width: 180px;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;

  img {
    width: 100%;
    object-fit: cover;
  }

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 750px) {
    width: 150px;
  }
`;

export const Menu = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 1rem;

  a {
    position: relative;
    text-decoration: none;
    font-weight: 600;
    color: #2d3748;
    padding: 8px 16px;
    border-radius: 99px;
    transition: all 0.25s ease-out;

    &:hover {
      color: #00ad4e;
      background-color: #e6f7ee;
      transform: scale(1.05);
    }
  }

  @media (min-width: 750px) and (max-width: 900px) {
    gap: 1rem;
    font-size: 0.95rem;
  }
  @media (max-width: 750px) {
    display: none;
  }
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;

  .btn-fill {
    background: linear-gradient(135deg, #00c656 0%, #00ad4e 100%);
    color: white;
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    font-size: 15px;
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 173, 78, 0.25);
    transition: all 0.3s ease-out;

    &:hover {
      background: linear-gradient(135deg, #00b850 0%, #009a46 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(0, 173, 78, 0.4);
    }
  }

  #dropdown-item-button {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    color: #00ad4e !important;
    font-size: 2rem;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    &::after {
      display: none;
    }

    &:hover,
    &:focus,
    &:active {
      background: #e6f7ee !important;
      border-radius: 8px;
    }
  }

  .dropdown-menu {
    right: 0 !important;
    left: auto !important;
    margin-top: 10px !important;
    background: rgba(235, 255, 231, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 173, 78, 0.2);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);

    border-radius: 20px;
    padding: 10px;

    animation: ${fadeInDown} 0.3s ease-out;
  }

  .dropdown-item {
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    font-size: 1rem;
    color: #2d3748;
    padding: 12px 20px;
    border-radius: 12px;
    margin-bottom: 2px;
    transition: all 0.2s ease-out;

    &:hover,
    &:focus {
      color: #00ad4e;
      background-color: #e6f7ee;
      transform: scale(1.03);
    }

    &:active {
      background-color: #e6f7ee;
      color: #00ad4e;
    }
  }

  @media (max-width: 750px) {
    .btn-fill {
      font-size: 14px;
      padding: 8px 16px;
    }
  }
`;
