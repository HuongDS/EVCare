import styled, { css } from "styled-components";

type ActionButtonProps = {
  text: string;
  color?: string;
  backgroundColor?: string;
  action?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

const ActionButton = styled.button<{
  color?: string;
  $bg?: string;
  disabled?: boolean;
}>`
  font-family: "Outfit", sans-serif;
  font-weight: 600;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  color: ${({ color }) => color || "white"};
  background-color: ${({ $bg }) => $bg || "#16a34a"};
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  ${({ disabled }) =>
    disabled &&
    css`
      background-color: #d1d5db;
      color: #9ca3af;
      cursor: not-allowed;
      opacity: 0.8;
      transform: none;
    `}

  @media (max-width: 576px) {
    width: 100%;
    font-size: 15px;
    padding: 12px 16px;
  }
`;

export default function ButtonAction({
  text,
  color,
  backgroundColor,
  action,
  type = "button",
  disabled = false,
}: ActionButtonProps) {
  return (
    <ActionButton
      color={color}
      $bg={backgroundColor}
      onClick={action}
      type={type}
      disabled={disabled}
    >
      {text}
    </ActionButton>
  );
}
