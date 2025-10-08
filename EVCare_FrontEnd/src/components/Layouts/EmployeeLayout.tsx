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
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();
  const isOrderPage = location.pathname.includes("/technician/order");

  // 🟩 State cho collapsed
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh", fontFamily: "'Outfit', sans-serif" }}>
      <HeaderStaff />
      <Layout style={{ flexDirection: "row" }}>
        <Sider
          width={250}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          collapsedWidth={60}
          onCollapse={(val) => setCollapsed(val)}
          style={{
            background: colorBgContainer,
            transition: "all 0.3s ease",
          }}
        >
          {menuOverride ?? <Sidebar role={role} collapsed={collapsed} />}
        </Sider>

        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
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
