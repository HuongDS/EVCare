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

const mainColor = ({ $bg }: { $bg: string }) => $bg || "#00ad4e";
const lightColor = "#00c656";

const hoverMainColor = "#009a46";
const hoverLightColor = "#00b850";

const ActionButton = styled.button<{ $color: string; $bg: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: fit-content;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-family: "Outfit", sans-serif;
  color: ${({ $color }) => $color || "white"};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, ${lightColor} 0%, ${mainColor} 100%);
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.25);
  transition: all 0.3s ease-out;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, ${hoverLightColor} 0%, ${hoverMainColor} 100%);
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 173, 78, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 173, 78, 0.3);
  }

  &:disabled {
    background: #cdd3d8;
    color: #8a94a1;
    cursor: not-allowed;
    box-shadow: none;
  }
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
    <ActionButton $color={color} $bg={backgroundColor} onClick={action} type={type} disabled={disabled}>
      {icon}
      {text}
    </ActionButton>
  );
}
