import styled from "styled-components";

type ActionButtonProps = {
  text: string;
  color: string;
  backgroundColor: string;
  action: () => void;
};

const ActionButton = styled.button<{ color: string; $bg: string }>`
  width: fit-content;
  max-height: fit-content;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  color: ${({ color }) => color || "black"};
  font-weight: bold;
  cursor: pointer;
  background-color: ${({ $bg }) => $bg || "green"};
    margin-right: 10px;
`;

export default function ButtonAction({ text, color, backgroundColor, action }: ActionButtonProps) {
  return (
    <ActionButton color={color} $bg={backgroundColor} onClick={action}>
      {text}
    </ActionButton>
  );
}
