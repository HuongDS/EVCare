import React, { useEffect, useState } from "react";
import { Avatar, Badge, Space } from "antd";
import { CalendarOutlined, BellOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  HeaderContainer,
  LogoContainer,
  DateContainer,
} from "./HeaderStaff.styled";
import EvCare from "../../assets/EVCare.png";
import { useNavigate } from "react-router";
import { getMe } from "../../services/authService";
import type { AccountViewModel } from "../../models/Accounts/accountViewModel";
import type { ResponseDto } from "../../models/AuthModel/authModel";

const HeaderStaff: React.FC = () => {
  const [account, setAccount] = useState<ResponseDto<AccountViewModel> | null>(
    null
  );
  const today = dayjs().format("D MMM, YYYY");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const Account = await getMe();
      setAccount(Account);
    };
    fetchData();
  }, []);

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
        <Avatar
          src={`https://ui-avatars.com/api/?name=${account?.data?.last_Name}&background=random`}
          alt={"hihi"}
          onClick={() => navigate("/staff/general")} //fix đường dẫn ở đây nhé
        />
      </Space>
    </HeaderContainer>
  );
};

export default HeaderStaff;
