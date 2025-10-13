import type React from "react";
import styled from "styled-components";
import "bootstrap-icons/font/bootstrap-icons.css";
interface props {
  icon: string;
  message: React.ReactNode;
}

//dùng để hiện thông báo khi không có item nào match với searchValue
export const NOT_FOUND_ITEMS = ({ icon, message }: props) => {
  return (
    <Wrrapper>
      <i className={icon}></i>
      <h4>{message}</h4>
    </Wrrapper>
  );
};

const Wrrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #c1c1c1;
  height: 400px;

  i {
    font-size: 30px;
  }
  h4 {
    font-family: "Outfit", sans-serif;
    font-weight: bold;
  }
`;
