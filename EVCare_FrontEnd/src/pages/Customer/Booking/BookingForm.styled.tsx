import { Modal } from "react-bootstrap";
import styled from "styled-components";

export const BookingFormWrapper = styled(Modal)`
  .modal-dialog {
    max-width: 80%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px auto;
    overscroll-behavior: contain;

    @media (max-width: 1024px) {
      max-width: 90%;
      margin: 15px auto;
    }

    @media (max-width: 768px) {
      max-width: 95%;
      margin: 10px auto;
    }
  }

  .modal-content {
    min-height: 90vh;
    display: flex;
    flex-direction: column;
    font-family: "Outfit", sans-serif;
    padding: 20px 40px;
    box-sizing: border-box;
    border-radius: 12px;
    overscroll-behavior: contain;

    @media (max-width: 1024px) {
      padding: 20px 25px;
    }

    @media (max-width: 768px) {
      padding: 15px 18px;
    }
  }

  .modal-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px 20px;

    @media (max-width: 768px) {
      padding: 0;
    }
  }
`;

export const SubSection = styled.div`
  margin-bottom: 24px;
`;

export const FormGroup = styled.div`
  margin-bottom: 5px;
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 3px;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

export const BookingFormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    padding: 10px 15px;
  }
`;

export const FormTitle = styled.h2`
  font-weight: 600;
  color: #00ad4e;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

export const CloseButton = styled.button`
  background-color: #fff;
  border: 2px solid #d1d5db;
  width: 30px;
  height: 30px;
  border-radius: 7px;
  font-size: 1rem;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s ease;

  &:hover {
    background-color: #ee0d0d;
    border-color: #ee0d0d;
    color: white;
  }

  @media (max-width: 768px) {
    width: 26px;
    height: 26px;
    font-size: 0.9rem;
  }
`;

export const BookingFormBody = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 0 5%;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    padding: 0;
  }
`;

export const SubTitle = styled.div`
  display: flex;
  gap: 2%;
  h5 {
    font-weight: 600;
    color: #00ad4e;
  }

  @media (max-width: 768px) {
    h5 {
      font-size: 16px;
    }
  }
`;

export const NumberIcon = styled.i`
  color: #00ad4e;
  font-size: 1.7em;
`;

export const LeftBody = styled.div`
  margin: 0 10%;

  @media (max-width: 1024px) {
    margin: 0 5%;
  }

  @media (max-width: 768px) {
    margin: 0;
  }
`;

export const ImageUpload = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    border-color: #10b981;
    background: #f0fdf4;
  }

  @media (max-width: 768px) {
    padding: 18px;
    font-size: 13px;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 5px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

export const Required = styled.span`
  color: #ef4444;
`;

export const RightBody = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 10%;

  @media (max-width: 1024px) {
    margin: 0 5%;
  }

  @media (max-width: 768px) {
    margin: 0;
  }
`;

export const BookingFormButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    background: #00ad4e;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 24px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    writing-mode: horizontal-tb;
    text-transform: uppercase;

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    &:hover:enabled {
      background: #00c65e;
    }
  }
`;

export const ServiceOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const Checkbox = styled.input`
  margin-right: 12px;
  width: 18px;
  height: 18px;
  accent-color: #10b981;
`;

export const MoreInfoLink = styled.button`
  color: #10b981;
  font-size: 14px;
  font-weight: 500;
  border: none;
  background: none;
  cursor: pointer;
  text-decoration: underline;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

export const TimeInputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const TimeInput = styled.div`
  position: relative;
`;

export const TimeInputField = styled(Input)`
  padding-left: 10%;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  @media (max-width: 768px) {
    font-size: 13px;
    min-height: 100px;
  }
`;

export const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
  max-height: 90vh;
  overscroll-behavior: contain;

  @media (max-width: 768px) {
    justify-content: flex-start;
    max-height: none;
    margin: 20px;
  }
`;
