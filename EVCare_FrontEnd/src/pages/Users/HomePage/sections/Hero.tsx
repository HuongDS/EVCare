import styled from "styled-components";
import carImg from "../../../../assets/VF3.png";
import { useNavigate } from "react-router";

const HeroWrapper = styled.section`
  padding: 20px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-family: "Manrope", sans-serif;
`;

const HeroContent = styled.div`
  margin-top: 5%;
  margin-left: 10%;
  display: flex;
  flex-direction: column;
  h1 {
    margin: 0;
    font-size: 50px;
  }

  span {
    font-weight: bold;
    color: #0039a6;
  }

  p {
    margin: 0;
    font-family: "Outfit", sans-serif;
    font-size: 20px;
  }

  a {
    margin-top: 200px;
    font-size: large;
    color: #00ad4e;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.5em;
      text-align: justify;
    }

    p {
      font-size: 1em;
      text-align: justify;
    }
    button {
      font-size: 1.3em;
      width: 50%;
    }
    max-width: 95%;
    height: auto;
  }
`;

const HeroImage = styled.div`
  img {
    @media (max-width: 768px) {
      max-width: 95%;
      height: auto;
    }
  }
`;

const CTAButton = styled.button`
  width: 40%;
  height: auto;
  margin-top: 30px;
  margin-left: 20%;
  font-family: "Outfit", sans-serif;
  font-size: 30px;
  font-weight: 600;
  color: white;
  border-radius: 20px;
  border: 0;
  background-color: #00ad4e;
  box-shadow: 5px 5px #ccc;

  &:hover {
    background-color: #0039a6;
    transform: translateY(5px) translateX(5px);
    box-shadow: none;
  }
`;

const Hero = () => {
  const navigate = useNavigate();
  return (
    <HeroWrapper>
      <HeroContent>
        <h1>
          Keep Your EV in <span>Top Shape</span> with{" "}
          <span>Smart Service System</span>
        </h1>

        <p>
          Book your service online, track real-time repair progress with ease.
          Our service center ensures your electric vehicle gets expert care
          every time.
        </p>

        <CTAButton onClick={() => navigate("/service")}>
          Book a Service
        </CTAButton>
      </HeroContent>

      <HeroImage>
        <img src={carImg} alt="EV Car" />
      </HeroImage>
    </HeroWrapper>
  );
};

export default Hero;
