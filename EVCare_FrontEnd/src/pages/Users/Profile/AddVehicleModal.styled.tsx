import styled, { css, keyframes } from "styled-components";

// ==== ANIMATIONS ====
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.96) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

// ==== OVERLAY ====
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.25s ease forwards;
`;

// ==== CONTENT ====
export const ModalContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 600px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
  padding: 32px 28px;
  color: #222;
  animation: ${fadeIn} 0.3s ease;
  font-family: "Outfit", sans-serif;
`;

// ==== TITLE ====
export const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #222;
  text-align: center;
  margin-bottom: 32px;
`;

// ==== FORM GROUP ====
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;

  label {
    font-size: 15px;
    font-weight: 600;
    color: #333;
  }

  input,
  select {
    padding: 12px 16px;
    border: 1.5px solid #d9d9d9;
    border-radius: 8px;
    font-size: 15px;
    font-family: inherit;
    background-color: #fff;
    color: #333;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    appearance: none;
    transition: all 0.25s ease;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='%23666'><path d='M2 5l5 5 5-5z'/></svg>");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 12px;

    &:focus {
      outline: none;
      border-color: #00ad4e;
      box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.15);
    }

    &:hover {
      border-color: #bdbdbd;
    }
  }
`;

// ==== BUTTONS ====
export const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1.5px solid #f1f1f1;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    button {
      width: 100%;
    }
  }
`;

const buttonBase = css`
  padding: 12px 22px;
  font-weight: 600;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
`;

// ==== SUBMIT BUTTON ====
export const SubmitButton = styled.button`
  ${buttonBase};
  background: linear-gradient(135deg, #00ad4e, #00c65e);
  color: #fff;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.35);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #00a34a, #00b256);
    transform: translateY(-1px);
    box-shadow: 0 0 10px rgba(0, 173, 78, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ==== CANCEL BUTTON ====
export const CancelButton = styled.button`
  ${buttonBase};
  background: #fff;
  color: #666;
  border: 1.5px solid #ddd;

  &:hover {
    background: #fafafa;
    border-color: #ccc;
  }
`;

// ==== IMAGE PREVIEW ====
export const PreviewImage = styled.img`
  margin-top: 12px;
  width: 200px;
  border-radius: 10px;
  border: 2px solid #e0e0e0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.25s ease;

  &:hover {
    transform: scale(1.03);
  }
`;
