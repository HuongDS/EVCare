import { Tooltip } from "antd";
import { CircleCheck, CircleX } from "lucide-react";
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
  error?: boolean;
}

export default function TextFieldAnimation({
  type,
  text,
  required = false,
  setText,
  error,
}: TextFieldData) {
  const isFilled = text.trim() !== "";
  return (
    <div>
      <Field>
        <FieldGroup $hasText={text !== ""}>
          <span>{type}</span>
          <input
            type={type}
            value={text}
            onChange={(e) => setText(e.target.value)}
            required={required}
          />
        </FieldGroup>
        {error ? (
          <TooltipStyled
            title={"Please enter alphabet characters"}
            placement="top"
            color="#00AD4E"
          >
            <CircleX className="status-icon" color="red" />
          </TooltipStyled>
        ) : (
          isFilled && <CircleCheck className="status-icon" color="green" />
        )}
      </Field>
    </div>
  );
}

const TooltipStyled = styled(Tooltip)`
  .ant-tooltip-inner {
    font-family: "Outfit", sans-serif !important;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    background-color: #00ad4e;
    border-radius: 8px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
  }

  .ant-tooltip-arrow::before {
    background-color: #00ad4e;
  }
`;
