//SideBar.tsx
import type { MenuProps } from "antd";
import { RoleEnum } from "../../models/enums/RoleEnum";
import { LinkStyled, MenuStyled, SidebarContainer } from "./SideBar.styled";
import {
  ApartmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  InboxOutlined,
  LineChartOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  ShoppingOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { deleteToken, logout } from "../../services/authService";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../../states/store";
import { logoutRedux } from "../../states/authSlice";

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string | React.ReactNode;
  route?: string;
  action?: () => void;
  children?: MenuItem[];
}

// Menu mặc định theo role
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
    {
      key: "9",
      icon: <LogoutOutlined />,
      label: "Logout",
      action: () => logout,
    },
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
      route: "/staff/customers",
    },
    {
      key: "8",
      icon: <LogoutOutlined />,
      label: "Logout",
      action: () => logout,
    },
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
      icon: <LogoutOutlined />,
      label: "Logout",
      action: () => logout,
    },
  ],
  [RoleEnum.CUSTOMER]: [],
};

interface SidebarProps {
  role: RoleEnum;
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const [selectedKey, setSelectedKey] = useState<string[]>(["1"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const currentPath = window.location.pathname;
    const foundKey = menuByRole[role].find(
      (item) => item.route === currentPath
    )?.key;

    if (foundKey) {
      setSelectedKey([foundKey]);
    }
  }, [role]);

  const handleMenuClick = ({ key }: { key: string }) => {
    const selectedItem = menuByRole[role].find((item) => item.key === key);

    if (selectedItem?.action) {
      selectedItem.action();
      deleteToken();
      dispatch(logoutRedux());
      navigate("/");
    }
    setSelectedKey([key]);
  };

  const renderMenuItems = (menu: MenuItem[]): MenuProps["items"] => {
    return menu.map((item) => {
      if (item.children) {
        return { ...item, children: renderMenuItems(item.children) };
      }
      return {
        ...item,
        label: <LinkStyled to={item.route || "#"}>{item.label}</LinkStyled>,
      };
    });
  };

  return (
    <SidebarContainer>
      <MenuStyled
        mode="inline"
        selectedKeys={selectedKey}
        items={renderMenuItems(menuByRole[role])}
        onClick={handleMenuClick}
      />
    </SidebarContainer>
  );
};

export default Sidebar;
