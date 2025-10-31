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
    border: 2px solid #ffffff;
    color: #ffffff;
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

  .boton-elegante::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle,
      rgba(214, 240, 210, 0.557) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    transform: scale(0);
    transition: transform 0.5s ease;
  }

  .boton-elegante:hover::after {
    transform: scale(4);
  }

  .boton-elegante:hover {
    color: white;
    border-color: #666666;
    background: #292929;
  }
`;

export default BackButton;
