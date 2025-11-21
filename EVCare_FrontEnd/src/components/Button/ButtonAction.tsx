import { Tooltip } from "antd";
import styled from "styled-components";

type ButtonVariant = "primary" | "secondary" | "danger" | "outline";

type ActionButtonProps = {
  text: string;
  variant?: ButtonVariant;
  action: () => void;
  icon?: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  fullWidth?: boolean;
  tooltipTitle?: string;
};

const getButtonStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case "primary":
      return {
        bg: "linear-gradient(135deg, #00ad4e 0%, #00c853 100%)",
        color: "white",
        hoverBg: "#00c853",
        shadow: "0 4px 12px rgba(0, 173, 78, 0.3)",
      };
    case "secondary":
      return {
        bg: "white",
        color: "#00ad4e",
        hoverBg: "#e8f5e9",
        shadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        border: "2px solid #00ad4e",
      };
    case "danger":
      return {
        bg: "#f44336",
        color: "white",
        hoverBg: "#d32f2f",
        shadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
      };
    case "outline":
      return {
        bg: "transparent",
        color: "#666",
        hoverBg: "#f5f5f5",
        shadow: "none",
        border: "2px solid #e0e0e0",
      };
    default:
      return {
        bg: "#00ad4e",
        color: "white",
        hoverBg: "#00c853",
        shadow: "0 4px 12px rgba(0, 173, 78, 0.3)",
      };
  }
};

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 12px;
  border: none;
  border-radius: 10px;
  font-family: "Outfit", sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};

  ${({ $variant }) => {
    const styles = getButtonStyles($variant);
    return `
      background: ${styles.bg};
      color: ${styles.color};
      box-shadow: ${styles.shadow};
      ${styles.border ? `border: ${styles.border};` : ""}
      
      &:hover:not(:disabled) {
        background: ${styles.hoverBg};
        transform: translateY(-2px);
        box-shadow: ${styles.shadow.replace("0.3", "0.4")};
      }
    `;
  }}

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #e0e0e0;
    color: #9e9e9e;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  svg {
    flex-shrink: 0;
  }
`;

export default function ButtonAction({
  icon,
  text,
  variant = "primary",
  action,
  type = "button",
  disabled = false,
  fullWidth = false,
  tooltipTitle,
}: ActionButtonProps) {
  return (
    <StyledButton
      $variant={variant}
      $fullWidth={fullWidth}
      onClick={action}
      type={type}
      disabled={disabled}
    >
      {disabled ? (
        <Tooltip title={tooltipTitle} color="#00ad4e">
          {icon}
          {text}
        </Tooltip>
      ) : (
        <>
          {icon}
          {text}
        </>
      )}
    </StyledButton>
  );
}
