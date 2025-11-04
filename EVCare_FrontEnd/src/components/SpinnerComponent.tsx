import { Spin } from "antd";
import styled from "styled-components";

const SpinStyled = styled(Spin)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
const SpinnerComponent = () => <SpinStyled size="large" />;

export default SpinnerComponent;
