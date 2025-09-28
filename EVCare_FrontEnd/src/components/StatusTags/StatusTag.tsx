import { StatusColors } from "./StatusColors";
import styled from "styled-components";

const TagStatus = styled.div<{ $bg: string; $cl: string }>`
  height: fit-content;
  width: max-content;
  border-radius: 5px;
  padding: 0 3px;
  background-color: ${(props) => props.$bg || "#ccc"}20;
  color: ${(props) => props.$cl || "black"};
  text-shadow: 0 0 20px white;
  font-weight: bold;
  font-family: "Outfit", sans-serif;
`;

interface StatusProps {
  status: string;
}
export default function StatusTag({ status }: StatusProps) {
  return (
    <TagStatus $bg={StatusColors[status]} $cl={StatusColors[status]}>
      <span>{status}</span>
    </TagStatus>
  );
}
