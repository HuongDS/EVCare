import styled, { css } from "styled-components";

const Field = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 5px 10px;
  height: 50px;
  input {
    border: none;
    flex: 1;

    &:focus {
      border: none;
      outline: none;
    }
  }
`;

const FieldGroup = styled.div<{ $hasText: boolean }>`
  position: relative;
  margin-left: 2%;
  span {
    position: absolute;
    left: 0;
    top: 20%;
    transform: translateY(0);
    font-size: 15px;
    color: #999;
    transition: transform 0.3s ease;
  }

  input {
    margin-top: 10px;
    font-size: 18px;
    padding: 2px 0;
  }

  &:hover span,
  &:focus-within span {
    transform: translateY(-10px);
    font-size: 12px;
    color: #ccc;
  }

  ${({ $hasText }) =>
    $hasText &&
    css`
      span {
        transform: translateY(-10px);
        font-size: 12px;
        color: #ccc;
      }
    `}
`;

interface TextFieldData {
  type: string;
  text: string;
  required: boolean;
  setText: (val: string) => void;
}

export default function TextFieldAnimation({ type, text, required = false, setText }: TextFieldData) {
  return (
    <div>
      <Field>
        <FieldGroup $hasText={text !== ""}>
          <span>{type}</span>
          <input type={type} value={text} onChange={(e) => setText(e.target.value)} required={required} />
        </FieldGroup>
      </Field>
    </div>
  );
}
