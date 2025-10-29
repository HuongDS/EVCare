import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styled from "styled-components";
import Authentication from "../../pages/Shared/Auth/Authentication";
import { ChatWidget } from "../../pages/Customer/Chat/ChatWidget";

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
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <Outlet />
          </div>
        </div>
      </Main>
      <Footer />

      <ChatWidget />
    </Container>
  );
}
