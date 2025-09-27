import styled from "styled-components";
import carImg from "../../../../assets/VF3.png";
import { useNavigate } from "react-router";

const HeroWrapper = styled.section`
  padding: 20px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-family: "Manrope", sans-serif;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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
    font-family: "Outfit", sans-serif;
    font-size: 20px;
  }

  a {
    margin-top: 200px;
    font-size: large;
    color: #00ad4e;
  }

  @media (max-width: 768px) {
    margin: 0;
    padding: 50px;
    align-items: center;
    justify-content: center;
    text-align: center;
    h1 {
      font-size: 20px;
    }
    p {
      font-size: 18px;
    }
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    margin: 0;
    padding: 50px;
    text-align: justify;

    h1 {
      font-size: 25px;
    }
    p {
      font-size: 19px;
    }
  }
`;

const HeroImage = styled.div`
  text-align: center;

  img {
    width: 95%;
    @media (max-width: 768px) {
      width: 80%;
      height: auto;
    }
    @media (min-width: 768px) and (max-width: 1200px) {
      width: 80%;
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

  @media (max-width: 768px) {
    margin: 10px 0 0;
    padding: 5px 20px;
    justify-content: center;
    font-size: 18px;
    width: fit-content;
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    margin: 16px 0 0;
    padding: 8px 22px;
    justify-content: center;
    font-size: 18px;
    width: fit-content;
  }
`;

const Hero = () => {
  const navigate = useNavigate();
  return (
    <HeroWrapper>
      <HeroContent data-aos="fade-right">
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

      <HeroImage data-aos="fade-left">
        <img src={carImg} alt="EV Car" />
      </HeroImage>
    </HeroWrapper>
  );
};

export default Hero;
