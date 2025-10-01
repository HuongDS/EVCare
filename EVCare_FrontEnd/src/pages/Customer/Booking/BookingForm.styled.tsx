import { Modal } from "react-bootstrap";
import styled from "styled-components";

export const BookingFormWrapper = styled(Modal)`
  .modal-dialog {
    max-width: 70%;
  }

  .modal-content {
    max-height: 100vh;
    overflow-y: auto;
    font-family: "Outfit", sans-serif;
    padding: 20px;
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
`;

export const Input = styled.input`
  width: 100%;
  padding: 5px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

export const BookingFormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const FormTitle = styled.h2`
  width: 60%;
  display: flex;
  justify-content: flex-end;
  font-weight: 600;
  color: #00ad4e;
`;

export const CloseButton = styled.button`
  font-size: 1em;
  height: 50%;
  border: none;
  border-radius: 5px;
  background-color: #ccc;
  color: white;
  &:hover {
    color: red;
    background-color: white;
    border: 1px solid #ccc;
  }
`;

export const BookingFormBody = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  height: 80%;
  padding: 0 5%;
`;

export const SubTitle = styled.div`
  display: flex;
  gap: 2%;
  h5 {
    font-weight: 600;
    color: #00ad4e;
  }
`;

export const NumberIcon = styled.i`
  color: #00ad4e;
  font-size: 1.7em;
`;

export const LeftBody = styled.div`
  margin: 0 10%;
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
`;
export const Required = styled.span`
  color: #ef4444;
`;

export const RightBody = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 10%;
`;

export const BookingFormButton = styled.div`
  display: flex;
  justify-content: center;
  button {
    width: 20%;
    padding: 8px;
    border: none;
    border-radius: 10px;
    background-color: #00ad4e;
    color: white;
    font-weight: 600;
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
`;
export const TimeInputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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
`;
