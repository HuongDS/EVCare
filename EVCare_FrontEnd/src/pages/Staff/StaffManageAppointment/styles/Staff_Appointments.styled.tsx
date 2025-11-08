import styled, { css, keyframes } from "styled-components";

export const ListAppointmentStyled = styled.div`
  max-height: 70vh;
  overflow-y: auto;
`;

export const TitleWrapper = styled.div`
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    color: #4caf50;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const SpinnerStyled = styled.div`
  margin: 0 10px;
`;

const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

export const PageTransition = styled.div<{ $isCreating: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  animation: ${({ $isCreating }) =>
    $isCreating
      ? css`
          ${slideIn} 1s ease forwards
        `
      : "none"};
`;

export const AppoitmentWrapper = styled.div``;
