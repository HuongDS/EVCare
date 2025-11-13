import { CircleCheck, CircleX, Eye, EyeOff } from "lucide-react";
import { useState, type ReactNode } from "react";
import styled, { css } from "styled-components";

interface IconData {
  icon: ReactNode;
  id?: string;
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
  id,
  type,
  label,
  text,
  required = false,
  setText,
  error,
  errorMessage,
}: IconData) {
  const isFilled = text.trim() !== "";
  const [showPass, setShowPass] = useState(false);

  const getIconPass = () => {
    if (showPass) {
      return (
        <EyeOff
          onClick={() => setShowPass(false)}
          style={{ cursor: "pointer" }}
          size={22}
        />
      );
    }
    return (
      <Eye
        onClick={() => setShowPass(true)}
        style={{ cursor: "pointer" }}
        size={22}
      />
    );
  };

  const isPassword = type === "password" && text.trim().length !== 0;

  return (
    <div>
      <Field>
        <div>{icon}</div>

        <FieldGroup $hasText={text !== ""}>
          <span>{label}</span>
          <Input
            id={id}
            type={
              isPassword ? (showPass ? "text" : "password") : type.toLowerCase()
            }
            value={text}
            onChange={(e) => setText(e.target.value.trim())}
            required={required}
          />
        </FieldGroup>
        <IconGroup>
          {isPassword && getIconPass()}
          {error ? (
            <CircleX className="status-icon" color="red" size={20} />
          ) : (
            isFilled && (
              <CircleCheck className="status-icon" color="green" size={20} />
            )
          )}
        </IconGroup>
      </Field>
      {error && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </div>
  );
}

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

const IconGroup = styled.div`
  display: flex;
  gap: 5%;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin-left: 5px;
  margin-bottom: 0;
`;

const Input = styled.input`
  input::-ms-reveal,
  input::-ms-clear {
    display: none;
  }
`;
