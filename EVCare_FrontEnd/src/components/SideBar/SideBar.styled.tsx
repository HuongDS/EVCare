import { Menu } from "antd";
import { Link } from "react-router";
import styled from "styled-components";

export const SidebarContainer = styled.div`
  background: #fbfffc;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  font-family: "Outfit", sans-serif;

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

export const MenuStyled = styled(Menu)`
  font-family: "Outfit", sans-serif;

  span {
    font-size: 18px;

    &:hover,
    &:focus {
      font-weight: bold;
    }
  }
`;

export const LinkStyled = styled(Link)`
  color: #ccc;
  font-size: 18px;
  &:hover,
  &:focus {
    font-weight: bold;
  }
`;
