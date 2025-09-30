import styled from "styled-components";

interface NameBoxProps {
  label?: string;
  name: string;
}

export default function NameBoxComponent({ label, name }: NameBoxProps) {
  return (
    <Wrapper>
      {label && <Label>{label}</Label>}
      <Box>{name}</Box>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  padding-bottom: 1%;
`;

const Label = styled.div`
  font-size: 0.8em;
  font-weight: 500;
  text-align: left;
  opacity: 0.5;

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;
const Box = styled.div`
  border-radius: 8px;
  font-size: 1.3em;
  text-align: left;
  min-width: 200px;
  width: 100%;
  max-width: 230px;

  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 1em;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    font-size: 1em;
    padding: 8px 12px;
  }
`;
