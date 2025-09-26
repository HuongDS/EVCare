import styled from "styled-components";

const BehindServiceWrapper = styled.div`
  font-family: "Outfit", sans-serif;
  padding: 5vw 0;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  gap: 3vw;
`;

const DetailsNumberWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const DetailsNumber = styled.p`
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 1000;
`;

const DetailsDescription = styled.p`
  font-size: clamp(1.2rem, 2vw, 2.5rem);
  font-weight: 700;
  margin-top: 0;
  color: #0039a6;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 50%;
`;

const Title = styled.h1`
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 800;
`;

const Content = styled.p`
  font-size: clamp(1.2rem, 2vw, 2.5rem);
  margin-bottom: 20px;
  text-align: justify;
`;

const Highlight = styled.span`
  color: #0039a6;
  font-weight: 700;
`;

export default function BehindService() {
  return (
    <BehindServiceWrapper>
      <ContentWrapper>
        <Title>Behind Service</Title>
        <Content>
          Behind every smart maintenance service is a{" "}
          <Highlight>passionate and highly skilled team</Highlight>. With years
          of experience in developing solutions for the EV industry, we combine{" "}
          <Highlight>technical expertise</Highlight> with{" "}
          <Highlight>cutting-edge technology</Highlight> to deliver the{" "}
          <Highlight>safest and most transparent experience</Highlight> for our
          customers.
        </Content>
      </ContentWrapper>
      <DetailsNumberWrapper>
        <DetailsNumber>5000+</DetailsNumber>
        <DetailsDescription>EVs successfully maintained</DetailsDescription>
        <DetailsNumber>50+</DetailsNumber>
        <DetailsDescription>
          Certified and skilled technicians
        </DetailsDescription>
        <DetailsNumber>10</DetailsNumber>
        <DetailsDescription>Years of trusted experience</DetailsDescription>
      </DetailsNumberWrapper>
    </BehindServiceWrapper>
  );
}
