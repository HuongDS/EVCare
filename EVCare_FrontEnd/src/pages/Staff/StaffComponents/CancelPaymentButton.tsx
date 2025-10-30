import styled from "styled-components";

interface props {
  onclick: () => void;
}
const CancelPaymentButton = ({ onclick }: props) => {
  return (
    <StyledWrapper>
      <button onClick={onclick}>Cancel Method</button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    border: none;
    color: #fff;
    background-image: linear-gradient(30deg, #f60e0e, #ec0e0e);
    border-radius: 15px;
    background-size: 100% auto;
    font-family: inherit;
    font-size: 17px;
    padding: 0.2em 1em;
  }

  button:hover {
    background-position: right center;
    background-size: 200% auto;
    -webkit-animation: pulse 2s infinite;
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

export default CancelPaymentButton;
