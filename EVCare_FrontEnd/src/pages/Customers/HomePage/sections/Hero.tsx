import styled from "styled-components";
import carImg from "../../../../assets/VF3.png";

const HeroWrapper = styled.section`
  padding: 20px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-family: "Manrope", sans-serif;
`;

const HeroContent = styled.div`
  margin-top: 50px;
  margin-left: 80px;
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
`;

const HeroImage = styled.div``;

const CTAButton = styled.button`
  width: 300px;
  height: 50px;
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

        <CTAButton>Book a Service</CTAButton>

        <a href="#explore">Explore more ↓</a>
      </HeroContent>

      <HeroImage>
        <img src={carImg} alt="EV Car" />
      </HeroImage>
    </HeroWrapper>
  );
};

export default Hero;
