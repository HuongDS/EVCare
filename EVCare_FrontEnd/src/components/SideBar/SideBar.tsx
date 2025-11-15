// SideBar.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { MenuProps } from "antd";
import {
  HomeOutlined,
  SolutionOutlined,
  TeamOutlined,
  ToolOutlined,
  ContainerOutlined,
  SettingOutlined,
  LineChartOutlined,
  FileTextOutlined,
  FolderOutlined,
  WarningOutlined,
  LogoutOutlined,
  InboxOutlined,
  ScheduleOutlined,
  WechatWorkOutlined,
  ApartmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { RoleEnum } from "../../models/enums/RoleEnum";
import { deleteToken, logout } from "../../services/authService";
import { useAppDispatch } from "../../states/store";
import { logoutRedux } from "../../states/authSlice";
import { LinkStyled, MenuStyled, SidebarContainer } from "./SideBar.styled";

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  route?: string;
  isLogout?: boolean;
}

const menuByRole: Record<RoleEnum, MenuItem[]> = {
  [RoleEnum.ADMIN]: [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "General",
      route: "/admin/general",
    },
    {
      key: "2",
      icon: <SolutionOutlined />,
      label: "Customer & Vehicle",
      route: "/admin/manage-customers-and-vehicles",
    },
    {
      key: "3",
      icon: <TeamOutlined />,
      label: "Manage Employees",
      route: "/admin/manage-employees",
    },
    {
      key: "4",
      icon: <ToolOutlined />,
      label: "Manage Parts",
      route: "/admin/manage-parts",
    },
    {
      key: "5",
      icon: <ContainerOutlined />,
      label: "Manage Services",
      route: "/admin/manage-services",
    },
    {
      key: "6",
      icon: <SettingOutlined />,
      label: "Center Information",
      route: "/admin/center-information",
    },
    {
      key: "7",
      icon: <LineChartOutlined />,
      label: "Reports",
      route: "/admin/finance-reports",
    },
    {
      key: "8",
      icon: <FileTextOutlined />,
      label: "Applications",
      route: "/admin/applications",
    },
    {
      key: "9",
      icon: <FolderOutlined />,
      label: "Categories",
      route: "/admin/categories",
    },
    {
      key: "10",
      icon: <WarningOutlined />,
      label: "Block Date",
      route: "/admin/blockDate",
    },
    { key: "11", icon: <LogoutOutlined />, label: "Logout", isLogout: true },
  ],

  [RoleEnum.STAFF]: [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "General",
      route: "/staff/general",
    },
    {
      key: "2",
      icon: <InboxOutlined />,
      label: "Inventory",
      route: "/staff/inventory",
    },
    {
      key: "3",
      icon: <TeamOutlined />,
      label: "Technicians",
      route: "/staff/technicians",
    },
    {
      key: "4",
      icon: <UserOutlined />,
      label: "Customers",
      route: "/staff/customers",
    },
    {
      key: "5",
      icon: <ScheduleOutlined />,
      label: "Appointments",
      route: "/staff/appointments",
    },
    {
      key: "6",
      icon: <SolutionOutlined />,
      label: "Application",
      route: "/staff/application",
    },
    {
      key: "7",
      icon: <WechatWorkOutlined />,
      label: "Chat",
      route: "/staff/chat-with-customer",
    },
    { key: "8", icon: <LogoutOutlined />, label: "Logout", isLogout: true },
  ],

  [RoleEnum.TECHNICIAN]: [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "General",
      route: "/technician",
    },
    {
      key: "2",
      icon: <ApartmentOutlined />,
      label: "My Jobs",
      route: "/technician/my-jobs",
    },
    {
      key: "3",
      icon: <ClockCircleOutlined />,
      label: "History",
      route: "/technician/history",
    },
    {
      key: "4",
      icon: <SolutionOutlined />,
      label: "Application",
      route: "/technician/application",
    },
    { key: "5", icon: <LogoutOutlined />, label: "Logout", isLogout: true },
  ],

  [RoleEnum.CUSTOMER]: [],
};

interface SidebarProps {
  role: RoleEnum;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const [selectedKey, setSelectedKey] = useState<string[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const currentPath = window.location.pathname;
    const match = menuByRole[role].find((item) => item.route === currentPath);
    if (match) setSelectedKey([match.key]);
  }, [role]);

  const handleClick: MenuProps["onClick"] = ({ key }) => {
    const item = menuByRole[role].find((m) => m.key === key);
    if (!item) return;

    if (item.isLogout) {
      deleteToken();
      dispatch(logoutRedux());
      logout();
      navigate("/");
      return;
    }

    if (item.route) {
      navigate(item.route);
      setSelectedKey([key]);
    }
  };

  const items: MenuProps["items"] = menuByRole[role].map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.isLogout ? item.label : <LinkStyled to={item.route!}>{item.label}</LinkStyled>,
  }));

  return (
    <SidebarContainer>
      <MenuStyled mode="inline" selectedKeys={selectedKey} items={items} onClick={handleClick} />
    </SidebarContainer>
  );
};

export default Sidebar;
