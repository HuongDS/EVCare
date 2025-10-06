import {
  HomeOutlined,
  ApartmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
  SolutionOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string | React.ReactNode;
  route?: string;
  children?: MenuItem[];
}

export const technicianOrderMenu: MenuItem[] = [
  {
    key: "1",
    icon: <HomeOutlined />,
    label: "High-Voltage Battery System",

    children: [
      {
        key: "1.1",
        icon: <HomeOutlined />,
        label: "Battery Modules",
        route: "/technician/general/battery-modules",
      },
      {
        key: "1.2",
        icon: <HomeOutlined />,
        label: "High-voltage cables & connectors",
        route: "/technician/general/battery-packs",
      },
      {
        key: "1.3",
        icon: <HomeOutlined />,
        label: "On-board charger",
        route: "/technician/general/bms",
      },
      {
        key: "1.4",
        icon: <HomeOutlined />,
        label: "HV fuses, contactors, relays",
        route: "/technician/general/battery-management-system",
      },
    ],
  },
  {
    key: "2",
    icon: <ApartmentOutlined />,
    label: "Electric Drive System",
    route: "/technician/my-jobs",
  },
  {
    key: "3",
    icon: <CalendarOutlined />,
    label: "Control & Electronics",
    route: "/technician/schedule",
  },
  {
    key: "4",
    icon: <ClockCircleOutlined />,
    label: "Braking & Suspension System",
    route: "/technician/history",
  },
  {
    key: "5",
    icon: <LogoutOutlined />,
    label: "Steering & Body",
    route: "/technician/logout",
  },
  {
    key: "6",
    icon: <SolutionOutlined />,
    label: "Interior Accessories",
    route: "/technician/application",
  },
  {
    key: "7",
    icon: <QuestionCircleOutlined />,
    label: "Tools & Repair Materials",
    route: "/technician/help",
  },
];
