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
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 0px;
  color: #0039a6;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 900px;
  margin-top: 100px;
  margin-left: 100px;
  margin-right: 120px;
`;

const Title = styled.h1`
  font-size: 50px;
  font-weight: 800;
`;

const Content = styled.p`
  font-size: 25px;
  margin-bottom: 20px;
  margin-left: 200px;
  margin-right: 200px;
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
