import styled from "styled-components";

const BehindServiceWrapper = styled.div`
  font-family: "Outfit", sans-serif;
  padding: 50px 0;
  text-align: left;
  display: flex;
`;

const DetailsNumberWrapper = styled.p`
  font-size: 100px;
  font-weight: bold;
  display: flex;
`;

const DetailsNumber = styled.p`
  font-size: 100px;
  font-weight: 1000;
  margin-bottom: 0px;
`;

const DetailsDescription = styled.p`
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 0px;
  color: #0039a6;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 900px;
  margin-top: 150px;
  margin-left: 50px;
`;

const Title = styled.h1`
  font-size: 50px;
  font-weight: 800;
`;

const HighlightBlue = styled.span`
  color: #0039a6;
  font-weight: 700;
`;

const Content = styled.p`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
  margin-left: 200px;
  margin-right: 200px;
  text-align: justify;
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
      <DetailsNumberWrapper></DetailsNumberWrapper>
      <div>
        <DetailsNumber>5000+</DetailsNumber>
        <DetailsDescription>EVs successfully maintained</DetailsDescription>
        <DetailsNumber>50+</DetailsNumber>
        <DetailsDescription>
          Certified and skilled technicians
        </DetailsDescription>
        <DetailsNumber>10</DetailsNumber>
        <DetailsDescription>Years of trusted experience</DetailsDescription>
      </div>
    </BehindServiceWrapper>
  );
}
