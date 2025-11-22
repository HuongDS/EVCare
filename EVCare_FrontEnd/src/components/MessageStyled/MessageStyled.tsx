import type React from "react";
import styled from "styled-components";
import "bootstrap-icons/font/bootstrap-icons.css";
interface props {
  icon: React.ReactNode;
  message: React.ReactNode;
  height?: string;
}

export const NOT_FOUND_ITEMS = ({ icon, message, height }: props) => {
  return (
    <Wrrapper style={{ height: height }}>
      {icon}
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
