import styled from "styled-components";

type ActionButtonProps = {
  text: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  action: () => void;
  icon?: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  backgroundColorHover?: string;
};

const ActionButton = styled.button<{
  $color: string;
  $bg: string;
  $borderColor: string;
  $backgroundColorHover: string;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 5px 14px;
  border: none;
  border-radius: 8px;
  font-family: "Outfit", sans-serif;
  font-size: 15px;
  font-weight: 500;

  color: ${({ $color }) => $color || "#ffffff"};
  background-color: ${({ $bg }) => $bg || "#007b55"};
  border: 2px solid ${({ $borderColor }) => $borderColor || "#ffffffff"};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover:not(:disabled) {
    background-color: ${({ $backgroundColorHover }) =>
      $backgroundColorHover || "#153f00"};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    background-color: #005c40;
    transform: translateY(0);
  }

  &:disabled {
    background-color: #e0e0e0;
    color: #9e9e9e;
    cursor: not-allowed;
  }
`;

export default function ButtonAction({
  icon,
  text,
  color = "white",
  backgroundColor = "#007b55",
  borderColor = backgroundColor,
  backgroundColorHover = "#153f00",
  action,
  type = "button",
  disabled = false,
}: ActionButtonProps) {
  return (
    <ActionButton
      $color={color}
      $borderColor={borderColor}
      $bg={backgroundColor}
      $backgroundColorHover={backgroundColorHover}
      onClick={action}
      type={type}
      disabled={disabled}
    >
      {icon}
      {text}
    </ActionButton>
  );
}
