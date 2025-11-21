import React from "react";
import { Space } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { HeaderContainer, LogoContainer, DateContainer } from "./HeaderStaff.styled";
import EvCare from "../../assets/EVCare.png";
import { logout, deleteToken } from "../../services/authService";
import DropdownMenu from "../Header/DropdownMenu";
import HTTP_STATUS from "../../constants/Code/HttpStatusCode";
import { useNavigate } from "react-router";
import { handleError } from "../../utils/errorHandler";
import { stopAdminDashboardConnection } from "../../signalr/adminConnection";
import { stopStaffDashboardConnection } from "../../signalr/staffConnection";
import { stopChatConnection } from "../../signalr/chatConnection";
import { logoutRedux } from "../../states/authSlice";
import type { AppDispatch } from "../../states/store";
import { useDispatch } from "react-redux";
import { stopTechnicianConnection } from "../../signalr/technicianConnection";
const HeaderStaff: React.FC = () => {
  const today = dayjs().format("D MMM, YYYY");
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = async () => {
    const response = await logout();
    if (!response) {
      handleError("Error when logout");
      return;
    }
    if (response.statusCode !== HTTP_STATUS.OK) {
      handleError("Error when logout");
      return;
    }
    deleteToken();
    dispatch(logoutRedux());
    await stopAdminDashboardConnection();
    await stopStaffDashboardConnection();
    await stopChatConnection();
    await stopTechnicianConnection();
    navigate("/");
  };

  return (
    <HeaderContainer>
      <LogoContainer src={EvCare} alt="EVCare Logo" />

      <Space align="center" size={20}>
        <DateContainer>
          <CalendarOutlined />
          <span>{today}</span>
        </DateContainer>
        <DropdownMenu handleLogout={handleLogout} />
      </Space>
    </HeaderContainer>
  );
};

export default HeaderStaff;
