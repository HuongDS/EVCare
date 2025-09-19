import styled from "styled-components";

const WrapperAboutUs = styled.div`
  font-family: "Outfit", sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #ffffff;
  margin-left: 200px;
  margin-right: 182px;
`;

const AboutUsTextWrapper = styled.div`
  flex: 1;
  max-width: 600px;
`;

const Title = styled.h2`
  font-size: 50px;
  font-weight: 800;
  margin-top: 100px;
  margin-bottom: 30px;
  text-transform: uppercase;
  text-align: left;
  letter-spacing: 2px;
`;

const AboutUsText = styled.p`
  font-size: 40px;
  font-weight: 600;
  text-align: left;
  margin: 0;
`;

const HighlightBlue = styled.span`
  color: #0056d2;
  font-weight: 700;
`;

const AboutUsDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 40%;
  margin-left: 100px;
`;

const AboutUsDetailNumber = styled.p`
  font-size: 100px;
  font-weight: bold;
  color: #000000;
  margin-top: 0;
  margin-bottom: 0;
`;

const AboutUsDetailDescription = styled.p`
  font-size: 30px;
  font-weight: 1000;
  color: #00ad4e;
  margin-top: 0;
  margin-bottom: 0;
`;

export default function AboutUs() {
  return (
    <WrapperAboutUs>
      <AboutUsTextWrapper>
        <Title>ABOUT US</Title>
        <AboutUsText>
          We are committed to delivering <HighlightBlue>reliable</HighlightBlue>
          , <HighlightBlue>transparent</HighlightBlue>, and{" "}
          <HighlightBlue>tech-driven</HighlightBlue> EV maintenance services,
          ensuring every journey is safe and worry-free.
        </AboutUsText>
      </AboutUsTextWrapper>

      <AboutUsDetail>
        <AboutUsDetailNumber>5,000+</AboutUsDetailNumber>
        <AboutUsDetailDescription>
          Electric Vehicles Serviced
        </AboutUsDetailDescription>
        <AboutUsDetailNumber>50+</AboutUsDetailNumber>
        <AboutUsDetailDescription>
          Certified Technicians
        </AboutUsDetailDescription>
        <AboutUsDetailNumber>10</AboutUsDetailNumber>
        <AboutUsDetailDescription>
          Years of Trusted Service
        </AboutUsDetailDescription>
      </AboutUsDetail>
    </WrapperAboutUs>
  );
}
