import styled from "styled-components";

export const ModalWrapper = styled.div`
  font-family: "Outfit", sans-serif;
  width: 100%;
  max-width: 420px;
  background-color: #fff;
  border-radius: 12px;
  padding: 24px 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  text-align: center;
  position: relative;
`;

export const ModalMessage = styled.p`
  font-size: 1rem;
  color: #333;
  margin-bottom: 24px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ConfirmButton = styled.button`
  background-color: #ff6b00; 
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e65c00;
  }

  &:disabled {
    background-color: #ffa066;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  background-color: #ccc;
  color: #333;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #bbb;
  }
`;
