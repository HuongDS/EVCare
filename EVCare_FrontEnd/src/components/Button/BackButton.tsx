import styled from "styled-components";

interface BackButtonProps {
  action: () => void;
}
const BackButton = ({ action }: BackButtonProps) => {
  return (
    <StyledWrapper>
      <button className="boton-elegante" onClick={action}>
        Back
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .boton-elegante {
    padding: 2px 10px;
    border: 2px solid #ccc;
    color: #ccc;
    font-size: 1.2rem;
    cursor: pointer;
    border-radius: 18px;
    transition: all 0.4s ease;
    outline: none;
    position: relative;
    overflow: hidden;
    font-weight: bold;
    font-family: "Outfit", sans-serif;
  }

  .boton-elegante:hover::after {
    transform: scale(4);
  }

  .boton-elegante:hover {
    color: white;
    border-color: #666666;
    background: linear-gradient(90deg, #00c9ff 0%, #92fe9d 100%);
  }
`;

export default BackButton;
