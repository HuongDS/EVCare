import styled from "styled-components";

const BehindServiceWrapper = styled.div`
  font-family: "Outfit", sans-serif;
  text-align: left;
  display: flex;
  align-items: center;
  padding: 0 5%;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 768px) {
    max-width: 100%;
    height: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 5%;
  }
`;

const DetailsNumberWrapper = styled.section`
  font-size: clamp(2rem, 10vw, 5rem);
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: start;
    flex-wrap: wrap;
    gap: 2rem;
    width: 100%;
  }
`;

const DetailsItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (max-width: 768px) {
    flex: 1 1 45%;
  }
`;

const DetailsNumber = styled.p`
  font-size: clamp(2rem, 10vw, 5rem);
  font-weight: 1000;
  margin-bottom: 0;
`;

const DetailsDescription = styled.p`
  font-size: clamp(1rem, 1.5vw, 1.8rem);
  font-weight: 700;
  margin-bottom: 0;
  color: #0039a6;
  text-align: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 50%;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Title = styled.h1`
  font-size: clamp(2rem, 6vw, 5rem);
  font-weight: 800;
  text-align: center;
`;

const HighlightBlue = styled.span`
  color: #0039a6;
  font-weight: 700;
`;

const Content = styled.p`
  font-size: clamp(1.2rem, 1.8vw, 2.5rem);
  width: 60%;
  font-weight: 700;
  text-align: justify;
  margin-top: 20px;
`;

export default function AboutUs() {
  return (
    <BehindServiceWrapper>
      <ContentWrapper>
        <Title>About Us</Title>
        <Content>
          We are committed to delivering <HighlightBlue>reliable</HighlightBlue>
          , <HighlightBlue>transparent</HighlightBlue>, and{" "}
          <HighlightBlue>tech-driven</HighlightBlue> EV maintenance services,
          ensuring every journey is safe and worry-free.
        </Content>
      </ContentWrapper>

      <DetailsNumberWrapper>
        <DetailsItem>
          <DetailsNumber>5000+</DetailsNumber>
          <DetailsDescription>EVs successfully maintained</DetailsDescription>
        </DetailsItem>
        <DetailsItem>
          <DetailsNumber>50+</DetailsNumber>
          <DetailsDescription>
            Certified and skilled technicians
          </DetailsDescription>
        </DetailsItem>
        <DetailsItem>
          <DetailsNumber>10</DetailsNumber>
          <DetailsDescription>Years of trusted experience</DetailsDescription>
        </DetailsItem>
      </DetailsNumberWrapper>
    </BehindServiceWrapper>
  );
}
