import { Menu } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const SidebarContainer = styled.div`
  background: #fbfffc;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  font-family: "Outfit", sans-serif;
  overflow-x: hidden;
  overflow-y: hidden;
  border-right: 1px solid #ccc;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  @media (max-width: 768px) {
    padding: 8px 0;
  }
`;

export const Logo = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;

  @media (max-width: 768px) {
    padding: 12px 16px;
    margin-bottom: 12px;
  }
`;

export const MenuStyled = styled(Menu)`
  font-family: "Outfit", sans-serif;
  background: transparent;

  .ant-menu-item,
  .ant-menu-submenu-title {
    font-size: 20px;
    height: 45px;
    line-height: 48px;
    margin: 4px 8px;
    border-radius: 8px;
    transition: all 0.3s ease;

    @media (max-width: 768px) {
      font-size: 15px;
      height: 44px;
      line-height: 44px;
      margin: 2px 8px;
    }
  }

  .ant-menu-item-selected {
    background: linear-gradient(135deg, #00ad4e 0%, #00ad4e 100%);
    border-radius: 30px;
    color: white;
    font-weight: 600;
    width: 90%;

    a {
      color: white !important;
    }

    .ant-menu-item-icon {
      color: white;
    }
  }

  .ant-menu-item:hover,
  .ant-menu-submenu-title:hover {
    color: #00ad4e;
    border-radius: 30px;
  }

  .ant-menu-submenu-selected > .ant-menu-submenu-title {
    color: #00ad4e;
  }

  .ant-menu-item-icon {
    font-size: 18px;

    @media (max-width: 768px) {
      font-size: 16px;
    }
  }

  span {
    font-size: 16px;

    @media (max-width: 768px) {
      font-size: 15px;
    }
  }
`;

export const LinkStyled = styled(Link)`
  color: #595959;
  text-decoration: none;
  display: block;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  &:hover,
  &:focus {
    color: #00ad4e;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  background: white;
  color: #595959;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: #ff4d4f;
    color: white;
    border-color: #ff4d4f;
  }
`;
