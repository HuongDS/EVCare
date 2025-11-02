// import { CircleCheck, CircleX } from "lucide-react";
import { CircleCheck, CircleX } from "lucide-react";
import type { ReactNode } from "react";
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

  div:nth-child(1) {
    display: flex;
    width: 10%;
    justify-content: space-around;
    font-size: 25px;
    border-right: 1px solid #ccc;
    padding-right: 10px;
  }
`;

const FieldGroup = styled.div<{ $hasText: boolean }>`
  position: relative;
  margin-left: 2%;
  width: 100%;

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
    width: 100%;
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

interface IconData {
  icon: ReactNode;
  label: string;
  type: string;
  text: string;
  required?: boolean;
  setText: (val: string) => void;
  error?: boolean;
  errorMessage?: string;
}

export default function TextFieldWithIcon({
  icon,
  type,
  label,
  text,
  required = false,
  setText,
  error,
  errorMessage,
}: IconData) {
  const isFilled = text.trim() !== "";
  return (
    <div>
      <Field>
        <div>{icon}</div>

        <FieldGroup $hasText={text !== ""}>
          <span>{label}</span>
          <input
            type={type.toLocaleLowerCase()}
            value={text}
            onChange={(e) => setText(e.target.value)}
            required={required}
          />
        </FieldGroup>
        {error ? (
          <CircleX className="status-icon" color="red" />
        ) : (
          isFilled && <CircleCheck className="status-icon" color="green" />
        )}
      </Field>
      {error && (
        <p
          style={{
            color: "red",
            fontSize: "12px",
            marginLeft: "5px",
            marginBottom: 0,
          }}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
