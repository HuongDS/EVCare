import styled from "styled-components";

interface props {
  onclick: () => void;
  text: string;
  width?: string;
  height?: string;
}
const ShowButton = ({ onclick, text, width, height }: props) => {
  return (
    <StyledWrapper $width={width ?? "auto"} $height={height ?? "auto"}>
      <button onClick={onclick}>{text}</button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $width: string; $height: string }>`
  button {
    border: none;
    color: #00ad4e;
    border: 2px solid #00ad4e;
    border-radius: 10px;
    background-size: 100% auto;
    font-family: "Outfit", sans-serif;
    font-weight: bold;
    font-size: 17px;
    padding: 0.2em 1em;
    width: ${(props) => props.$width || "auto"};
    height: ${(props) => props.$height || "auto"};
  }

  button:hover {
    background-position: right center;
    background-size: 200% auto;
    -webkit-animation: pulse 1s infinite;
    animation: pulse512 1.5s infinite;
  }

  @keyframes pulse512 {
    0% {
      box-shadow: 0 0 0 0 #05bada66;
    }

    70% {
      box-shadow: 0 0 0 10px rgb(218 103 68 / 0%);
    }

    100% {
      box-shadow: 0 0 0 0 rgb(218 103 68 / 0%);
    }
  }
`;

export default ShowButton;
