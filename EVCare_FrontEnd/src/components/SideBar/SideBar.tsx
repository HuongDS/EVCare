import React, { useState } from "react";
import { Menu } from "antd"; // Import Menu từ antd
import type { MenuProps } from "antd"; // Import type MenuProps từ antd
import { Link } from "react-router-dom";
import { RoleEnum } from "../../models/enums/RoleEnum";
import { SidebarContainer } from "./SideBar.styled";
import {
  HomeOutlined,
  SolutionOutlined,
  ShoppingOutlined,
  TeamOutlined,
  FileDoneOutlined,
  LineChartOutlined,
  InboxOutlined,
  UserOutlined,
  ApartmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string | React.ReactNode;
  route?: string;
  children?: MenuItem[];
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
      route: "/admin/customer-vehicle",
    },
    {
      key: "3",
      icon: <ShoppingOutlined />,
      label: "Appointments",
      route: "/admin/appointments",
    },
    {
      key: "4",
      icon: <TeamOutlined />,
      label: "Manage Employees",
      route: "/admin/manage-employees",
    },
    {
      key: "5",
      icon: <FileDoneOutlined />,
      label: "Manage Orders",
      route: "/admin/manage-orders",
    },
    {
      key: "6",
      icon: <SolutionOutlined />,
      label: "Service & Parts",
      children: [
        {
          key: "6.1",
          icon: <FileDoneOutlined />,
          label: "Service Categories",
          route: "/admin/service-categories",
        },
        {
          key: "6.2",
          icon: <FileDoneOutlined />,
          label: "Services",
          route: "/admin/services",
        },
        {
          key: "6.3",
          icon: <FileDoneOutlined />,
          label: "Part Categories",
          route: "/admin/part-categories",
        },
        {
          key: "6.4",
          icon: <FileDoneOutlined />,
          label: "Parts",
          route: "/admin/parts",
        },
      ],
    },
    {
      key: "7",
      icon: <LineChartOutlined />,
      label: "Finance & Reports",
      route: "/admin/finance-reports",
    },
    {
      key: "8",
      icon: <QuestionCircleOutlined />,
      label: "Help & Information",
      route: "/admin/help",
    },
    { key: "9", icon: <LogoutOutlined />, label: "Logout" },
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
      icon: <ShoppingOutlined />,
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
      icon: <QuestionCircleOutlined />,
      label: "Help & Information",
      route: "/staff/help",
    },
    {
      key: "8",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ],
  [RoleEnum.TECHNICIAN]: [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "General",
      route: "/technician/general",
    },
    {
      key: "2",
      icon: <ApartmentOutlined />,
      label: "My Jobs",
      route: "/technician/my-jobs",
    },
    {
      key: "3",
      icon: <CalendarOutlined />,
      label: "Schedule",
      route: "/technician/schedule",
    },
    {
      key: "4",
      icon: <ClockCircleOutlined />,
      label: "History",
      route: "/technician/history",
    },
    {
      key: "5",
      icon: <SolutionOutlined />,
      label: "Application",
      route: "/technician/application",
    },
    {
      key: "6",
      icon: <QuestionCircleOutlined />,
      label: "Help & Information",
      route: "/technician/help",
    },
    {
      key: "7",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ],
  [RoleEnum.CUSTOMER]: [],
};

interface SidebarProps {
  role: RoleEnum;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleMouseEnter = () => setCollapsed(false);
  const handleMouseLeave = () => setCollapsed(true);

  const renderMenuItems = (menu: MenuItem[]): MenuProps["items"] => {
    return menu.map((item) => {
      if (item.children) {
        return {
          ...item,
          children: renderMenuItems(item.children),
        };
      }
      return {
        ...item,
        label: (
          <Link to={item.route || "#"} style={{ textDecoration: "none" }}>
            {item.label}
          </Link>
        ),
      };
    });
  };

  return (
    <SidebarContainer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        inlineCollapsed={collapsed}
        items={renderMenuItems(menuByRole[role])}
      />
    </SidebarContainer>
  );
};

export default Sidebar;
