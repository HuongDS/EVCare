import React from "react";
import { Modal } from "@mui/material";
import styled, { keyframes } from "styled-components";
import ButtonAction from "../../../components/Button/ButtonAction";

interface AlertModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

const popIn = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 0;
    box-shadow: 0 0 0 rgba(0,0,0,0);
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
    box-shadow: 0 0 20px rgba(0, 255, 21, 0.5);
  }
  80% {
    transform: scale(0.95);
    box-shadow: 0 0 15px rgba(0, 255, 21, 0.4);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(0, 255, 21, 0.3);
  }
`;

const ModalWrapper = styled.div`
  width: 100%;
  max-width: 420px;
  background-color: #fff;
  border-radius: 12px;
  padding: 24px 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  text-align: center;
  position: relative;
  animation: ${popIn} 0.5s ease forwards;
`;

const ModalMessage = styled.p`
  font-family: "Outfit", sans-serif;
  font-size: 1rem;
  color: #333;
  margin-bottom: 24px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const AlertModal: React.FC<AlertModalProps> = ({
  open,
  onClose,
  onConfirm,
  message = "Are you sure?",
}) => {
  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 420,
        }}
      >
        <ModalWrapper>
          <ModalMessage>{message}</ModalMessage>
          <ButtonsContainer>
            <ButtonAction
              text="Cancel"
              color="#333"
              backgroundColor="#ccc"
              action={onClose}
            />
            <ButtonAction
              text="Confirm"
              color="#fff"
              backgroundColor="#00AD4E"
              action={() => {
                onConfirm();
                onClose();
              }}
            />
          </ButtonsContainer>
        </ModalWrapper>
      </div>
    </Modal>
  );
};

export default AlertModal;
