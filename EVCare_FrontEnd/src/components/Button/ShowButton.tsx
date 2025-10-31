import styled from "styled-components";

interface props {
  onclick: () => void;
  text: string;
}
const ShowButton = ({ onclick, text }: props) => {
  return (
    <StyledWrapper>
      <button onClick={onclick}>{text}</button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    border: none;
    color: #0c3902;
    border: 2px solid black;
    border-radius: 15px;
    background-size: 100% auto;
    font-family: "Outfit", sans-serif;
    font-weight: bold;
    font-size: 17px;
    padding: 0.2em 1em;
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
