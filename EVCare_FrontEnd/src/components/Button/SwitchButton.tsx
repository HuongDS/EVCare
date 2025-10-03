import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background-color: #ccc;
  height: 35px;
  border-radius: 5px;
  width: 60%;
`;

const Button = styled.button`
  border: none;
  height: 85%;
  width: 46%;
  border-radius: 5px;
  font-weight: bold;
  &.active {
    background-color: rgb(204, 204, 204);
    font-weight: lighter;
    color: #747474;
  }

  &.inactive {
    background-color: white;
    color: #00ad4e;
  }
`;

interface SwitchButtonProps {
  isSignUp: boolean;
  onChange: (value: boolean) => void;
}

export default function SwitchButton({
  isSignUp,
  onChange,
}: SwitchButtonProps) {
  return (
    <Wrapper>
      <Button
        className={isSignUp ? "active" : "inactive"}
        onClick={() => onChange(false)}
      >
        Sign In
      </Button>
      <Button
        className={!isSignUp ? "active" : "inactive"}
        onClick={() => onChange(true)}
      >
        Sign Up
      </Button>
    </Wrapper>
  );
}
