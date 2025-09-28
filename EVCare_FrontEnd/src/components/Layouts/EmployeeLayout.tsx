import React, { useState } from "react";
import { Layout, theme } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../SideBar/SideBar";
import HeaderStaff from "../Header/HeaderStaff";
import { RoleEnum } from "../../models/enums/RoleEnum";

const { Content, Sider } = Layout;

const EmployeeLayout: React.FC<{ role: RoleEnum }> = ({ role }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  const handleMouseEnter = () => setCollapsed(false);
  const handleMouseLeave = () => setCollapsed(true);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <HeaderStaff />
      <Layout style={{ flexDirection: "row" }}>
        <Sider
          width={200}
          trigger={null}
          collapsed={collapsed}
          collapsedWidth={80}
          style={{ background: colorBgContainer }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Sidebar role={role} />
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
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default EmployeeLayout;
