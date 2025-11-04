import { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import ErrorIcon from "../IconsAnimation/errorIcon";
import ButtonAction from "../Button/ButtonAction";
import { createPortal } from "react-dom";

const initBox = keyframes`
  from {
    transform: scale(110%);
  }

  to {
    transform: scale(100%);
  }
`;

const initLayout = keyframes`
  from {
    background-color: rgba(0, 0, 0, 0.0);
  }

  to {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const Layout = styled.div`
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${initLayout} 0.15s linear;
  z-index: 99999;
`;

interface PopUpProps {
  header: string;
  message: string;
  action: () => void;
}

export default function FailedModal({ header, message, action }: PopUpProps) {
  return createPortal(
    <Layout>
      <PopUp header={header} message={message} action={action} />
    </Layout>,
    document.body
  );
}

const Container = styled.div`
  position: relative;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
  border-radius: 20px;
  padding: 2rem 2rem;
  min-width: 30rem;
  animation: ${initBox} 0.15s linear;
  font-family: "Outfit", sans-serif;
`;

const IconContainer = styled.div``;

const BodyContainer = styled.div`
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const PopUp = ({ header, message, action }: PopUpProps) => {
  useEffect(() => {
    document.body.classList.add("no-scroll");

    return () => {
      document.body.classList.remove("no-scroll");
    };
  });

  return (
    <Container>
      <IconContainer>
        <ErrorIcon />
      </IconContainer>
      <BodyContainer>
        <h4>{header}</h4>
        <p>{message}</p>
      </BodyContainer>
      <ButtonContainer>
        <ButtonAction
          action={action}
          text="Close"
          backgroundColor="red"
          color="white"
        />
      </ButtonContainer>
    </Container>
  );
};
