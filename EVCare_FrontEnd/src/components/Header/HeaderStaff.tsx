import React from "react";
import { Badge, Space } from "antd";
import { CalendarOutlined, BellOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  HeaderContainer,
  LogoContainer,
  DateContainer,
} from "./HeaderStaff.styled";
import EvCare from "../../assets/EVCare.png";

const HeaderStaff: React.FC = () => {
  const today = dayjs().format("D MMM, YYYY");

  return (
    <HeaderContainer>
      <LogoContainer src={EvCare} alt="EVCare Logo" />

      <Space align="center" size={20}>
        <DateContainer>
          <CalendarOutlined />
          <span>{today}</span>
        </DateContainer>
        <Badge dot offset={[0, 2]}>
          <BellOutlined className="evc-icon" />
        </Badge>
      </Space>
    </HeaderContainer>
  );
};

export default HeaderStaff;
