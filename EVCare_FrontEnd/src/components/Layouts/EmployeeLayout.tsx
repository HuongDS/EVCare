import { Layout, theme } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../SideBar/SideBar";
import HeaderStaff from "../Header/HeaderStaff";
import { RoleEnum } from "../../models/enums/RoleEnum";
import { useState } from "react";

const { Content, Sider } = Layout;

const EmployeeLayout: React.FC<{
  role: RoleEnum;
  menuOverride?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ role, menuOverride, children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const location = useLocation();
  const isOrderPage = location.pathname.includes("/technician/order");

  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout
      style={{
        minHeight: "100vh",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <HeaderStaff />
      <Layout style={{ flexDirection: "row" }}>
        <Sider
          width={230}
          style={{
            background: colorBgContainer,
            transition: "all 0.3s ease",
            position: "sticky",
            top: 56,
            left: 0,
            height: "calc(100vh - 56px)",
            zIndex: 1000,
          }}
        >
          {menuOverride ?? <Sidebar role={role} collapsed={collapsed} />}
        </Sider>

        <Layout style={{ padding: "0" }}>
          <Content
            style={{
              margin: 0,
              background: colorBgContainer,
              overflow: "hidden",
            }}
          >
            {isOrderPage ? children : <Outlet />}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default EmployeeLayout;
