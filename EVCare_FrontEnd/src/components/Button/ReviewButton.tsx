import styled from "styled-components";

type ActionButtonProps = {
  text: string;
  color: string;
  backgroundColor: string;
  action: () => void;
  icon?: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
};

const ActionButton = styled.button<{ $color: string; $bg: string }>`
  display: flex;
  align-items: center;
  gap: 5px;
  width: fit-content;
  max-height: fit-content;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-family: "Outfit", sans-serif;
  color: ${({ $color }) => $color || "white"};
  font-weight: bold;
  cursor: pointer;
  background-color: ${({ $bg }) => $bg || "green"};
`;

export default function ButtonAction({
  icon,
  text,
  color,
  backgroundColor,
  action,
  type = "button",
  disabled = false,
}: ActionButtonProps) {
  return (
    <ActionButton
      $color={color}
      $bg={backgroundColor}
      onClick={action}
      type={type}
      disabled={disabled}
    >
      {icon}
      {text}
    </ActionButton>
  );
}
