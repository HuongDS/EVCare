import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styled from "styled-components";
import Authentication from "../../pages/Shared/Auth/Authentication";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;
const Main = styled.div`
  flex: 1;
`;
export default function Layout() {
  return (
    <Container>
      <Header />
      <Authentication />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Container>
  );
}
