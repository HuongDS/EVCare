import { type MenuProps } from "antd";
import {
  CarOutlined,
  DashboardOutlined,
  FireOutlined,
  HomeOutlined,
  QuestionCircleOutlined,
  RiseOutlined,
  StopOutlined,
  ThunderboltOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { SidebarContainer, MenuStyled } from "./Style/OrderMenu.styled";
import { useGetPartCategories } from "../../../services/partCategoryApi";

export interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string | React.ReactNode;
}

const icons = [
  <ToolOutlined />,
  <StopOutlined />,
  <ThunderboltOutlined />,
  <CarOutlined />,
  <RiseOutlined />,
  <DashboardOutlined />,
  <FireOutlined />,
];

export const TechnicianOrderMenu: React.FC<{
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}> = ({ selectedCategory, onSelectCategory }) => {
  const { data, isLoading } = useGetPartCategories({
    pageSize: 10,
    pageIndex: 1,
  });

  const technicianOrderMenu: MenuItem[] = [
    {
      key: "",
      icon: <HomeOutlined />,
      label: "All",
    },
    ...(data?.data?.items.map((cat, index) => ({
      key: cat.id.toString(),
      icon: icons[index] || <QuestionCircleOutlined />,
      label: cat.name,
    })) || []),
  ];

  return (
    <SidebarContainer>
      <MenuStyled
        mode="inline"
        selectedKeys={[selectedCategory]}
        items={
          isLoading ? [] : renderMenu(technicianOrderMenu, onSelectCategory)
        }
      />
    </SidebarContainer>
  );
};

const renderMenu = (
  menu: MenuItem[],
  onSelect: (key: string) => void
): MenuProps["items"] =>
  menu.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: <span>{item.label}</span>,
    onClick: () => onSelect(item.key),
  }));
