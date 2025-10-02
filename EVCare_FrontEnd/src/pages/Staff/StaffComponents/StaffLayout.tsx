import { Link, Outlet, useNavigate } from "react-router";
import logo from "../../assets/logo_emp.png";
import moment from "moment";
import styled from "styled-components";
import { useState } from "react";

const LayoutWrapper = styled.div`
  padding-left: 30px;
  display: grid;
  grid-template-columns: 1fr 6fr;
  min-height: 100vh;
  font-family: "Outfit", sans-serif;
  background-color: #f8fffb;
`;

const Logo = styled.div`
  width: 200px;
  display: flex;
  align-items: center;
  img {
    width: 100%;
    object-fit: fill;
  }
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const GroupItem = styled.button<{ active?: boolean }>`
  display: flex;
  width: 100%;
  column-gap: 15px;
  padding: 5px 10px;
  margin-right: 20px;
  border-radius: 20px;
  border: none;
  background-color: ${({ active }) => (active ? "#ccc" : "white")};
  color: ${({ active }) => (active ? "black" : "#686868")};
  font-weight: ${({ active }) => (active ? "bold" : "none")};
  &:focus,
  &:hover {
    background-color: #ccc;
    color: black;
    font-weight: bold;
  }
`;

const LeftContent = styled.div`
  border-right: 1px solid #ccc;
  padding-right: 20px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const RightContent = styled.div``;

const HeadContent = styled.div`
  padding: 10px 0;
  padding-right: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  font-size: 25px;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
`;

export default function StaffLayout() {
  const [activeMenu, setActiveMenu] = useState<string>("general");
  const navigate = useNavigate();
  let currentDate = moment().format("Do MMM, YYYY");
  return (
    <LayoutWrapper>
      <LeftContent>
        <div>
          <Logo>
            <Link to="/staff">
              <img src={logo} alt="EVCare logo" />
            </Link>
          </Logo>
          <Menu>
            <GroupItem
              active={activeMenu === "general"}
              onClick={() => {
                setActiveMenu("general");
                navigate("/staff");
              }}
            >
              <div>
                <i className="bi bi-house"></i>
              </div>
              <div>General</div>
            </GroupItem>
            <GroupItem
              active={activeMenu === "inventory"}
              onClick={() => {
                setActiveMenu("inventory");
                navigate("/staff");
              }}
            >
              <div>
                <i className="bi bi-archive"></i>
              </div>
              <div>Inventory</div>
            </GroupItem>
            <GroupItem
              active={activeMenu === "technicians"}
              onClick={() => {
                setActiveMenu("technicians");
                navigate("/staff");
              }}
            >
              <div>
                <i className="bi bi-person-gear"></i>
              </div>
              <div>Technicians</div>
            </GroupItem>
            <GroupItem
              active={activeMenu === "customers"}
              onClick={() => {
                setActiveMenu("customers");
                navigate("/staff");
              }}
            >
              <div>
                <i className="bi bi-people"></i>
              </div>
              <div>Customers</div>
            </GroupItem>
            <GroupItem
              active={activeMenu === "appointments"}
              onClick={() => {
                setActiveMenu("appointments");
                navigate("/staff/appointments");
              }}
            >
              <div>
                <i className="bi bi-calendar-check"></i>
              </div>
              <div>Appointments</div>
            </GroupItem>
            <GroupItem
              active={activeMenu === "application"}
              onClick={() => {
                setActiveMenu("application");
                navigate("/staff");
              }}
            >
              <div>
                <i className="bi bi-envelope-check"></i>
              </div>
              <div>Application</div>
            </GroupItem>
          </Menu>
        </div>
        <div>
          <GroupItem>
            <div>
              <i className="bi bi-box-arrow-left"></i>
            </div>
            <div>Log Out</div>
          </GroupItem>
        </div>
      </LeftContent>
      <RightContent>
        <HeadContent>
          <div>
            <i className="bi bi-calendar-event"></i>
          </div>
          <div>{currentDate}</div>
          <div>
            <i className="bi bi-bell"></i>
          </div>
        </HeadContent>
        <div>
          <Outlet />
        </div>
      </RightContent>
    </LayoutWrapper>
  );
}
