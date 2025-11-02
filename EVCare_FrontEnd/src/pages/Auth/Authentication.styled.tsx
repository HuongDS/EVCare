// File: Authentication.styled.tsx
import styled from "styled-components";
import { Modal, Form } from "react-bootstrap";

export const StyledModal = styled(Modal)`
  z-index: 1050 !important;

  .modal-dialog {
    max-width: 900px;
    width: 90%;
    max-height: 700px;
    height: 90%;
  }

  .modal-content {
    height: 100%;
    display: flex;
    font-family: "Outfit", sans-serif;
    border-radius: 12px;
    overflow: hidden;
    flex-direction: row;
    position: relative;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.1);

    @media (max-width: 1045px) {
      flex-direction: column;
      height: auto;
      max-height: 90vh;
      overflow-y: auto;
    }
  }
`;

export const SideImage = styled.div<{ $isSignUp: boolean }>`
  width: 50%;
  height: 100%;
  position: absolute;
  left: ${(p) => (p.$isSignUp ? "0" : "50%")};
  border-radius: ${(p) => (p.$isSignUp ? "12px 0 0 12px" : "0 12px 12px 0")};
  background: ${(p) =>
    p.$isSignUp
      ? "linear-gradient(to right, #ebffe7, #f9fff8)"
      : "linear-gradient(to left, #ebffe7, #f9fff8)"};
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;

  img {
    width: 80%;
    object-fit: cover;
  }

  @media (max-width: 1045px) {
    position: relative;
    width: 100%;
    height: 200px;
    border-radius: 12px 12px 0 0;
    left: 0;
  }
`;

export const FormContainer = styled(Modal.Body as any)<{ $isSignUp: boolean }>`
  position: absolute;
  right: ${(p) => (p.$isSignUp ? "0" : "50%")};
  width: 50%;
  height: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  z-index: 2;
  transition: right 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #fff;

  @media (max-width: 1045px) {
    position: relative;
    width: 100%;
    right: 0;
    height: auto;
  }
`;

export const HeaderBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;

  h1 {
    color: #00ad4e;
    font-weight: 700;
    margin-bottom: 1rem;
  }
`;

export const FormWrapper = styled(Form as any)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-right: 5px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #00ad4e;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #019344;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SubmitBtn = styled.button<{ $disabled?: boolean }>`
  min-height: 45px;
  border: none;
  border-radius: 20px;
  padding: 0 5px;
  background: ${(props) => (props.$disabled ? "#ccc" : "#00ad4e")};
  color: white;
  font-weight: 600;
  font-size: 1rem;
  transition: background 0.2s;

  &:hover {
    background: ${(props) => (props.$disabled ? "#ccc" : "#019344")};
  }
`;

export const Divider = styled.div`
  text-align: center;
  position: relative;
  padding: 5px;

  hr {
    border: none;
    height: 1px;
    background: rgba(7, 0, 0, 0.1);
    margin: 0;
  }

  span {
    background: white;
    padding: 0 0.75rem;
    font-weight: 600;
    font-size: 0.9rem;
    color: #686868;
    position: absolute;
    top: -0.6rem;
    left: 50%;
    transform: translateX(-50%);
  }
`;

export const NameGroup = styled.div`
  display: inline-flex;
  gap: 2%;
  > div {
    flex: 1;
  }
  input {
    width: 100%;
  }

  @media (max-width: 1045px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const FormWrapperOTP = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  align-items: center;
  p {
    font-weight: bold;
  }
`;
