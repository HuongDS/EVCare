import styled from "styled-components";

export const Nav = styled.div`
  width: 100%;
  position: relative;
`;

export const Menu = styled.nav<{ open?: boolean }>`
  display: flex;
  justify-content: space-between;
  font-size: 1rem;

  span {
    flex: 1;
    text-align: center;
    position: relative;
    font-weight: bold;
    color: #2f2f2f;
    cursor: pointer;
    padding: 0.2rem 0;
    white-space: nowrap;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      height: 2px;
      width: 100%; /* fix width */
      background: #00ad4e;
      transform: scaleX(0);
      transform-origin: center;
      transition: transform 0.3s ease;
    }

    &:hover::after {
      transform: scaleX(1);
    }

    &.active::after {
      transform: scaleX(1);
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    overflow: hidden;
    max-height: ${(props) => (props.open ? "1000px" : "0")};
    transition: max-height 0.7s ease;
  }
`;

export const DropdownButton = styled.button`
  display: none;
  background: #00ad4e;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  font-weight: bold;
  width: 100%;
  cursor: pointer;
  border-radius: 4px;

  @media (max-width: 768px) {
    display: block;
  }
`;
