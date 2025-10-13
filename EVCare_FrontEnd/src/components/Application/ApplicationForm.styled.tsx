import styled from "styled-components";
export const FormContainer = styled.form`
  width: 100%;
  max-width: 1000px;
  margin: 40px auto;
  padding: 40px 50px;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  font-family: "Outfit", sans-serif;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 992px) {
    max-width: 90%;
    padding: 30px 25px;
  }

  @media (max-width: 576px) {
    max-width: 100%;
    margin: 20px auto;
    padding: 20px 16px;
    border-radius: 0;
    box-shadow: none;
  }
`;

export const Title = styled.h2`
  text-align: center;
  color: #16a34a;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 10px;

  @media (max-width: 576px) {
    font-size: 22px;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 15px;
  color: #333;
  font-weight: 500;
`;

export const Input = styled.input`
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 15px;
  background: #f9fafb;
  transition: 0.2s;

  &:focus {
    outline: none;
    border-color: #16a34a;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
  }

  &[readonly] {
    background: #f1f5f9;
    color: #555;
  }
`;

export const TextArea = styled.textarea`
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 15px;
  min-height: 120px;
  resize: none;
  background: #f9fafb;
  transition: 0.2s;

  &:focus {
    outline: none;
    border-color: #16a34a;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const DateGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const SuccessText = styled.p`
  text-align: center;
  color: #16a34a;
  font-weight: 600;
  font-size: 15px;
`;

export const ErrorText = styled.p`
  text-align: center;
  color: #dc2626;
  font-weight: 600;
  font-size: 15px;
`;
